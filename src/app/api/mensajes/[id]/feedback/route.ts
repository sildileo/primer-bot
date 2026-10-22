import { obtenerVisitorId } from "@/server/seguridad/visitante";
import { guardarFeedback } from "@/server/db/conversacionesDb";
import { FeedbackSchema } from "@/compartido/feedback";
import { log } from "@/server/observabilidad/log";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const visitorId = await obtenerVisitorId();

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: "Pedido inválido" }, { status: 400 });
    }

    const resultado = FeedbackSchema.safeParse(body);
    if (!resultado.success) {
        return Response.json({ error: "Datos inválidos" }, { status: 400 });
    }

    try {
        const estado = await guardarFeedback(id, visitorId, resultado.data.valor);

        if (estado === "no_encontrado") {
            return Response.json({ error: "Mensaje no encontrado" }, { status: 404 });
        }

        return Response.json({ ok: true });
    } catch (error) {
        log("error", "feedback.guardar", { mensajeId: id, error });
        return Response.json({ error: "No se pudo guardar el feedback" }, { status: 500 });
    }
}