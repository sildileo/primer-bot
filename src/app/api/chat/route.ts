import {
    streamText,
    convertToModelMessages,
    isStepCount,
    createUIMessageStreamResponse,
    toUIMessageStream,
    validateUIMessages,
    createIdGenerator,
    type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { buscarIssues } from "@/server/ia/toolsBuscarIssues";
import { obtenerVisitorId } from "@/server/seguridad/visitante";
import { crearToolsDeGuardados } from "@/server/ia/toolsGuardados";
import { asegurarConversacion, cargarMensajes, guardarMensajes } from "@/server/db/conversacionesDb";
import { SYSTEM_PROMPT } from "@/server/ia/systemPrompt";
import { PedidoDeChatSchema } from "@/compartido/pedidoChat";
import { verificarLimite } from "@/server/seguridad/rateLimit";

export async function POST(req: Request) {

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconocida";
    const limite = verificarLimite(ip);

    if (!limite.permitido) {
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
    catch {
        return Response.json({ error: "Conversación no válida" }, { status: 403 })
    }

    const mensajesAnteriores = await cargarMensajes(id)

    const mensajes = [...mensajesAnteriores, message]

    const tools = { buscarIssues, ...crearToolsDeGuardados(visitorId) }

    const validados = await validateUIMessages({ messages: mensajes, tools })

    const result = streamText({
        model: openai("gpt-5.4-mini"),
        system: SYSTEM_PROMPT,
        messages: await convertToModelMessages(validados),
        tools,
        stopWhen: isStepCount(5),
        onStepEnd: ({ toolCalls }) => {
            console.log("Tools llamadas:", toolCalls.map((t) => t.toolName))
        }
    })

    result.consumeStream()

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({
            stream: result.stream,
            originalMessages: validados,
            generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
            onEnd: async ({ messages }) => {
                try {
                    await guardarMensajes(id, messages)
                }
                catch (error) {
                    console.error("No se pudieron guardar los mensajes: ", error)
                }

            }
        }),
    });
}