import {
    streamText,
    convertToModelMessages,
    isStepCount,
    createUIMessageStreamResponse,
    toUIMessageStream,
    validateUIMessages,
    createIdGenerator,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { buscarIssues } from "@/server/ia/toolsBuscarIssues";
import { obtenerVisitorId } from "@/server/seguridad/visitante";
import { crearToolsDeGuardados } from "@/server/ia/toolsGuardados";
import { asegurarConversacion, cargarMensajes, guardarMensajes } from "@/server/db/conversacionesDb";
import { SYSTEM_PROMPT } from "@/server/ia/systemPrompt";
import { PedidoDeChatSchema } from "@/compartido/pedidoChat";
import { verificarLimite } from "@/server/seguridad/rateLimit";
import { log } from "@/server/observabilidad/log";
import { MetadataMensajeSchema, type MensajePRimer } from "@/compartido/metadataMensaje";

const MODELO = "gpt-5.4-mini"

export async function POST(req: Request) {

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconocida";
    const limite = verificarLimite(ip);

    if (!limite.permitido) {
        log("warn", "chat.rate_limit", { ip, segundosParaReintentar: limite.segundosParaReintentar });

        return Response.json(
            { error: "Demasiados mensajes seguidos", segundosParaReintentar: limite.segundosParaReintentar },
            { status: 429, headers: { "Retry-After": String(limite.segundosParaReintentar) } },
        );
    }

    let body: unknown
    try {
        body = await req.json()
    } catch {
        return Response.json({ error: "Pedido inválido" }, { status: 400 })
    }

    const resultado = PedidoDeChatSchema.safeParse(body)

    if (!resultado.success) {
        return Response.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const visitorId = await obtenerVisitorId()

    const { id, message } = resultado.data;

    try {
        await asegurarConversacion(id, visitorId)
    }
    catch (error) {
        log("warn", "chat.conversacion_ajena", { conversationId: id, error })
        return Response.json({ error: "Conversación no válida" }, { status: 403 })
    }

    const tools = { buscarIssues, ...crearToolsDeGuardados(visitorId) }

    let validados: MensajePRimer[];
    try {
        const mensajesAnteriores = await cargarMensajes(id);
        validados = await validateUIMessages<MensajePRimer>({
            messages: [...mensajesAnteriores, message],
            tools,
            metadataSchema: MetadataMensajeSchema.optional(),
        });
    } catch (error) {
        log("error", "chat.cargar_historial", { conversationId: id, error });
        return Response.json(
            { error: "No se pudo cargar la conversación. Probá de nuevo en un momento." },
            { status: 500 },
        );
    }

    const inicio = Date.now();
    const toolsUsadas: string[] = [];

    const result = streamText({
        model: openai(MODELO),
        system: SYSTEM_PROMPT,
        messages: await convertToModelMessages(validados),
        tools,
        stopWhen: isStepCount(5),
        onStepEnd: ({ toolCalls }) => {
            toolsUsadas.push(...toolCalls.map((t) => t.toolName));
        },
    })

    result.consumeStream()

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({
            stream: result.stream,
            originalMessages: validados,
            generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
            messageMetadata: ({ part }) => {
                if (part.type === "start") {
                    return { modelo: MODELO, inicio };
                }
                if (part.type === "finish") {
                    return {
                        duracionMs: Date.now() - inicio,
                        tokensEntrada: part.totalUsage.inputTokens,
                        tokensSalida: part.totalUsage.outputTokens,
                        tokensTotales: part.totalUsage.totalTokens,
                    };
                }
            },
            onEnd: async ({ messages, responseMessage }) => {
                log("info", "chat.respuesta", {
                    conversationId: id,
                    duracionMs: Date.now() - inicio,
                    toolsUsadas,
                    tokens: responseMessage.metadata?.tokensTotales,
                });
                try {
                    await guardarMensajes(id, messages);
                } catch (error) {
                    log("error", "chat.guardar_mensajes", { conversationId: id, error });
                }
            },
        }),
    });
}