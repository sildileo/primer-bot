import Chat from "@/components/Chat";
import { leerVisitorId } from "@/server/seguridad/visitante";
import { obtenerUltimaConversacion, cargarMensajes, cargarFeedbacks } from "@/server/db/conversacionesDb";
import { listarIssuesGuardados } from "@/server/db/issuesGuardadosDb";

export default async function Page() {
  const visitorId = await leerVisitorId();
  const idExistente = visitorId ? await obtenerUltimaConversacion(visitorId) : null;

  const conversationId = idExistente ?? crypto.randomUUID();
  const mensajesIniciales = idExistente ? await cargarMensajes(idExistente) : []
  const feedbacksIniciales = idExistente ? await cargarFeedbacks(idExistente) : {}
  const guardadosIniciales = visitorId ? await listarIssuesGuardados(visitorId) : []

  return (
    <Chat
      conversationId={conversationId}
      mensajesIniciales={mensajesIniciales}
      feedbacksIniciales={feedbacksIniciales}
      guardadosIniciales={guardadosIniciales}
    />
  )
}