import { isToolUIPart } from "ai";
import type { MensajePRimer } from "@/compartido/metadataMensaje";

function resumirSalida(salida: unknown): string {
  if (Array.isArray(salida)) return `${salida.length} ${salida.length === 1 ? "resultado" : "resultados"}`;
  if (salida && typeof salida === "object") {
    if ("error" in salida) return `error: ${String(salida.error)}`;
    if ("guardado" in salida) return salida.guardado ? "guardado" : "no guardado (ya estaba)";
    if ("quitado" in salida) return salida.quitado ? "quitado" : "no quitado (no estaba)";
  }
  return "sin datos";
}

export default function PanelDebug({ mensaje }: { mensaje: MensajePRimer }) {
  const meta = mensaje.metadata;
  const tools = mensaje.parts.filter(isToolUIPart);

  return (
    <details className="detalles-ocultos:hidden group text-xs text-tinta-suave">
      <summary className="inline-flex min-h-11 cursor-pointer items-center hover:text-violeta-texto">
        Detalles técnicos
      </summary>
      <div className="mt-1 rounded-md border border-borde bg-superficie p-3 font-mono">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt>Modelo</dt>
          <dd>{meta?.modelo ?? "sin datos"}</dd>
          <dt>Duración</dt>
          <dd>{meta?.duracionMs != null ? `${(meta.duracionMs / 1000).toFixed(1)} s` : "sin datos"}</dd>
          <dt>Tokens</dt>
          <dd>
            {meta?.tokensTotales != null
              ? `${meta.tokensTotales} (${meta.tokensEntrada} de entrada, ${meta.tokensSalida} de salida)`
              : "sin datos"}
          </dd>
          <dt>Tools</dt>
          <dd>{tools.length === 0 ? "ninguna: respondió sin herramientas" : tools.length}</dd>
        </dl>

        {tools.length > 0 && (
          <ol className="mt-3 flex flex-col gap-2 border-t border-borde pt-3">
            {tools.map((tool) => (
              <li key={tool.toolCallId}>
                <p className="font-semibold text-tinta">{tool.type.replace("tool-", "")}</p>
                <p className="break-all">entrada: {JSON.stringify(tool.input)}</p>
                <p>salida: {tool.state === "output-available" ? resumirSalida(tool.output) : tool.state}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </details>
  );
}