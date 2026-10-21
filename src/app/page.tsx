"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  const cargando = status === "submitted" || status === "streaming";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">PRimer</h1>

      <div className="flex flex-1 flex-col gap-4 pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "self-end rounded-lg bg-blue-600 px-4 py-2 text-white" : "self-start"}
          >
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                );
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
        className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-2xl px-4 pb-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || cargando) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black shadow"
          value={input}
          placeholder="Contame qué lenguajes sabés y qué te interesa…"
          onChange={(e) => setInput(e.currentTarget.value)}
          disabled={cargando}
        />
      </form>
    </main>
  );
}