"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState } from "react";
import MensajeMarkdown from "@/components/MensajeMarkdown";
import IssueCard from "@/components/IssueCard";
import ListaGuardados from "@/components/ListaGuardados";
import type { IssueGuardado } from "@/lib/db/savedIssues";
import type { IssueResumen } from "@/lib/github/searchIssues";

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
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-8 px-4">
      <main className="flex min-w-0 flex-1 flex-col pt-8">
        <h1 className="mb-6 text-2xl font-bold">PRimer</h1>

        {/* En el celu, los guardados van en un desplegable arriba */}
        <details className="mb-4 md:hidden">
          <summary className="cursor-pointer text-sm font-medium">
            Mis issues guardados ({guardados.length})
          </summary>
          <div className="mt-3">
            <ListaGuardados guardados={guardados} />
          </div>
        </details>

        {messages.length === 0 && (
          <section className="my-auto py-12 text-center">
            <h2 className="text-xl font-semibold">Encontrá tu primera contribución open source</h2>
            <p className="mt-2 text-gray-500">
              Contame qué lenguajes sabés y qué te interesa. Te busco issues pensados para principiantes.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              {SUGERENCIAS.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  onClick={() => enviar(sugerencia)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-4 pb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "self-end rounded-lg bg-blue-600 px-4 py-2 text-white"
                  : "self-stretch"
              }
            >
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
                    return <p key={i} className="text-sm text-gray-500">🔍 Buscando issues…</p>;
                  }
                  if (Array.isArray(part.output)) {
                    return (
                      <div key={i} className="my-3 grid gap-3">
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
                    <details key={i} className="my-2 text-sm text-gray-500">
                      <summary>🔧 Usó la tool {part.type.replace("tool-", "")}</summary>
                      <pre className="overflow-x-auto text-xs">{JSON.stringify(part, null, 2)}</pre>
                    </details>
                  );
                }

                return null;
              })}
            </div>
          ))}

          {cargando && <p className="text-sm text-gray-500">Pensando…</p>}
          {error && <p className="text-sm text-red-500">Algo salió mal. Probá de nuevo.</p>}
        </div>

        <form
          className="sticky bottom-0 bg-background pb-6 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(input);
          }}
        >
          <input
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black shadow"
            value={input}
            placeholder="Contame qué lenguajes sabés y qué te interesa…"
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={cargando}
            aria-label="Mensaje para PRimer"
          />
        </form>
      </main>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto pt-8 md:block">
        <h2 className="mb-4 font-semibold">Mis issues guardados ({guardados.length})</h2>
        <ListaGuardados guardados={guardados} />
      </aside>
    </div>
  );
}