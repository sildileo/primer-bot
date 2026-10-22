"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState } from "react";
import MensajeMarkdown from "@/components/MensajeMarkdown";
import IssueCard from "@/components/IssueCard";
import ListaGuardados from "@/components/ListaGuardados";
import type { IssueGuardado } from "@/server/db/issuesGuardadosDb";
import type { IssueResumen } from "@/server/github/buscarIssuesEnGithub";
import BotonTema from "@/components/BotonTema";

const SUGERENCIAS = [
  "Sé un poco de Python y me interesa la web",
  "Sé JavaScript y quiero empezar con documentación",
  "Sé TypeScript, ¿qué issue me recomendás?",
];

type ChatProps = {
  conversationId: string;
  mensajesIniciales: UIMessage[];
  guardadosIniciales: IssueGuardado[];
};

export default function Chat({ conversationId, mensajesIniciales, guardadosIniciales }: ChatProps) {
  const [input, setInput] = useState("");
  const [guardados, setGuardados] = useState(guardadosIniciales);

  async function recargarGuardados() {
    const respuesta = await fetch("/api/guardados");
    if (respuesta.ok) setGuardados(await respuesta.json());
  }

  async function guardarDirecto(issue: IssueResumen) {
    const respuesta = await fetch("/api/guardados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: issue.url,
        titulo: issue.titulo,
        repo: issue.repo,
        etiquetas: issue.etiquetas,
      }),
    });
    if (respuesta.ok) await recargarGuardados();
  }

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    messages: mensajesIniciales,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
    onFinish: ({ message }) => {
      // si el bot guardó algo, actualizamos la sidebar
      if (message.parts.some((part) => part.type === "tool-guardarIssue")) {
        recargarGuardados();
      }
    },
  });

  const cargando = status === "submitted" || status === "streaming";
  const urlsGuardadas = new Set(guardados.map((issue) => issue.url));

  function enviar(texto: string) {
    if (!texto.trim() || cargando) return;
    sendMessage({ text: texto });
    setInput("");
  }

    return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-10 px-4">
      <main className="flex min-w-0 flex-1 flex-col pt-6">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PRimer</h1>
            <p className="text-sm text-tinta-suave">Tu cartilla de primeros issues</p>
          </div>
          <BotonTema />
        </header>

        {/* En el celu, la cartilla va en un desplegable arriba */}
        <details className="mb-6 rounded-lg border border-borde bg-superficie p-3 md:hidden">
          <summary className="min-h-11 cursor-pointer content-center font-medium">
            Tu cartilla ({guardados.length})
          </summary>
          <div className="mt-3">
            <ListaGuardados guardados={guardados} />
          </div>
        </details>

        {messages.length === 0 && (
          <section aria-labelledby="titulo-bienvenida" className="my-auto py-12 text-center">
            <h2 id="titulo-bienvenida" className="text-2xl font-bold tracking-tight">
              Encontrá tu primera contribución open source
            </h2>
            <p className="mx-auto mt-3 max-w-md text-tinta-suave">
              Contame qué lenguajes sabés y qué te interesa. Te busco issues pensados para quien recién empieza.
            </p>
            <ul className="mt-8 flex flex-col items-center gap-2" aria-label="Ejemplos para empezar">
              {SUGERENCIAS.map((sugerencia) => (
                <li key={sugerencia}>
                  <button
                    type="button"
                    onClick={() => enviar(sugerencia)}
                    className="min-h-11 rounded-full border border-borde bg-superficie px-5 text-sm hover:border-violeta hover:text-violeta-texto"
                  >
                    {sugerencia}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col gap-6 pb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-violeta-tenue px-4 py-2.5"
                  : "self-stretch"
              }
            >
              <span className="sr-only">{message.role === "user" ? "Vos dijiste:" : "PRimer respondió:"}</span>
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return message.role === "user" ? (
                    <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                  ) : (
                    <MensajeMarkdown key={i} texto={part.text} />
                  );
                }

                if (part.type === "tool-buscarIssues") {
                  if (part.state !== "output-available") {
                    return <p key={i} className="text-sm text-tinta-suave">Buscando issues en GitHub…</p>;
                  }
                  if (Array.isArray(part.output)) {
                    return (
                      <div key={i} className="my-4 grid gap-3">
                        {part.output.map((issue: IssueResumen) => (
                          <IssueCard
                            key={issue.url}
                            issue={issue}
                            guardado={urlsGuardadas.has(issue.url)}
                            onGuardar={() => guardarDirecto(issue)}
                          />
                        ))}
                      </div>
                    );
                  }
                  return null;
                }

                if (part.type.startsWith("tool-")) {
                  return (
                    <details key={i} className="my-2 text-sm text-tinta-suave">
                      <summary className="cursor-pointer">Usó la tool {part.type.replace("tool-", "")}</summary>
                      <pre className="mt-2 overflow-x-auto rounded-md bg-superficie p-3 font-mono text-xs">
                        {JSON.stringify(part, null, 2)}
                      </pre>
                    </details>
                  );
                }

                return null;
              })}
            </div>
          ))}

          {cargando && <p className="text-sm text-tinta-suave">PRimer está pensando…</p>}
          {error && <p className="text-sm text-margen">No se pudo obtener la respuesta. Probá de nuevo.</p>}
        </div>

        <form
          className="sticky bottom-0 bg-papel pb-6 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(input);
          }}
        >
          <input
            className="w-full rounded-lg border border-borde bg-superficie p-3 text-tinta shadow-sm placeholder:text-tinta-suave"
            value={input}
            placeholder="Contame qué lenguajes sabés y qué te interesa…"
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={cargando}
            aria-label="Mensaje para PRimer"
          />
        </form>
      </main>

      <aside
        aria-labelledby="titulo-cartilla"
        className="sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto py-6 md:block"
      >
        <div className="relative min-h-full rounded-lg border border-borde bg-superficie py-5 pl-10 pr-4 shadow-sm">
          {/* La línea roja del margen del cuaderno: decorativa */}
          <span aria-hidden="true" className="absolute inset-y-0 left-6 w-0.5 bg-margen opacity-70" />
          <h2 id="titulo-cartilla" className="mb-4 text-lg font-bold">
            Tu cartilla <span className="font-normal text-tinta-suave">({guardados.length})</span>
          </h2>
          <ListaGuardados guardados={guardados} />
        </div>
      </aside>
    </div>
  );
}