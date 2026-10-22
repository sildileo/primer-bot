import Chat from "@/components/Chat";
import { leerVisitorId } from "@/lib/visitor";
import { obtenerUltimaConversacion, cargarMensajes } from "@/lib/db/conversations";

export default async function Page() {
  const visitorId = await leerVisitorId();
  const idExistente = visitorId ? await obtenerUltimaConversacion(visitorId) : null;

  const conversationId = idExistente ?? crypto.randomUUID();
  const mensajesIniciales = idExistente ? await cargarMensajes(idExistente) : [];

  return <Chat conversationId={conversationId} mensajesIniciales={mensajesIniciales} />;
}