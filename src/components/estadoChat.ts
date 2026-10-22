import type { UIMessage } from "ai";

const TEXTO_POR_TOOL: Record<string, string> = {
  "tool-buscarIssues": "Buscando issues en GitHub…",
  "tool-guardarIssue": "Guardando en tu cartilla…",
  "tool-verGuardados": "Leyendo tu cartilla…",
  "tool-quitarIssue": "Sacando de tu cartilla…",
};

export function textoDeEstado(mensajes: UIMessage[], status: string): string | null {
  if (status === "submitted") return "Pensando…";
  if (status !== "streaming") return null;

  const ultimo = mensajes.at(-1);
  const ultimaParte = ultimo?.role === "assistant" ? ultimo.parts.at(-1) : undefined;

  if (!ultimaParte) return "Pensando…";
  if (ultimaParte.type === "text") return null; // ya está escribiendo: el texto habla solo

  const textoTool = TEXTO_POR_TOOL[ultimaParte.type];
  const toolTerminada =
    "state" in ultimaParte && (ultimaParte.state === "output-available" || ultimaParte.state === "output-error");

  if (textoTool && !toolTerminada) return textoTool;
  return "Pensando…"; // por ejemplo, después de buscar y antes de escribir
}

export function textoDeError(error: Error): string {
  try {
    const datos = JSON.parse(error.message);
    if (typeof datos.segundosParaReintentar === "number") {
      return `Mandaste muchos mensajes seguidos. Esperá ${datos.segundosParaReintentar} segundos y probá de nuevo.`;
    }
    if (typeof datos.error === "string") return datos.error;
  } catch {
    // el mensaje no era JSON: seguimos abajo
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "Parece que no tenés conexión a internet.";
  }
  return "No se pudo obtener la respuesta.";
}