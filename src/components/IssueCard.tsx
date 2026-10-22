"use client";

import { useState } from "react";
import type { IssueResumen } from "@/server/github/buscarIssuesEnGithub";

// ---------- Funciones de ayuda (afuera del componente) ----------

const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const MS_POR_HORA = 1000 * 60 * 60;

function haceCuanto(fechaIso: string): string {
  const diferenciaHoras = (new Date(fechaIso).getTime() - Date.now()) / MS_POR_HORA;
  if (Math.abs(diferenciaHoras) < 24) {
    return formatoRelativo.format(Math.round(diferenciaHoras), "hour");
  }
  return formatoRelativo.format(Math.round(diferenciaHoras / 24), "day");
}

function IconoTilde({ animar }: { animar: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="24" className={animar ? "animate-trazo" : ""} />
    </svg>
  );
}

// ---------- El componente ----------

type IssueCardProps = {
  issue: IssueResumen;
  guardado: boolean;
  onGuardar: () => Promise<boolean>;
};

export default function IssueCard({ issue, guardado, onGuardar }: IssueCardProps) {
  // 1. Estado y lógica (ANTES del return)
  const [estado, setEstado] = useState<"inicial" | "guardando" | "error">("inicial");
  const [recienGuardado, setRecienGuardado] = useState(false);

  async function alGuardar() {
    setEstado("guardando");
    const salioBien = await onGuardar();
    if (salioBien) {
      setRecienGuardado(true);
      setEstado("inicial");
    } else {
      setEstado("error");
    }
  }

  // 2. Lo que se dibuja
  return (
    <article className="relative rounded-lg border border-borde bg-superficie py-4 pl-6 pr-4 shadow-sm">
      <span aria-hidden="true" className="absolute inset-y-3 left-0 w-1 rounded-r bg-violeta" />

      <h3 className="font-semibold leading-snug">
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violeta-texto underline-offset-2 hover:underline"
        >
          {issue.titulo}
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </h3>

      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-suave">
        <div>
          <dt className="sr-only">Repositorio</dt>
          <dd className="font-mono">{issue.repo}</dd>
        </div>
        <div>
          <dt className="sr-only">Comentarios</dt>
          <dd>
            {issue.comentarios} {issue.comentarios === 1 ? "comentario" : "comentarios"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Última actividad</dt>
          <dd>actualizado {haceCuanto(issue.actualizado)}</dd>
        </div>
      </dl>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Etiquetas">
        {issue.etiquetas.map((etiqueta) => (
          <li
            key={etiqueta}
            className={
              etiqueta === "good first issue"
                ? "rounded-full bg-violeta-tenue px-2.5 py-0.5 font-mono text-xs text-violeta-texto"
                : "rounded-full border border-borde px-2.5 py-0.5 font-mono text-xs text-tinta-suave"
            }
          >
            {etiqueta}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {guardado ? (
          <p
            role={recienGuardado ? "status" : undefined}
            className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-violeta-texto ${
              recienGuardado ? "animate-guardado" : ""
            }`}
          >
            <IconoTilde animar={recienGuardado} /> En tu cartilla
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={alGuardar}
              disabled={estado === "guardando"}
              className="min-h-11 rounded-md border border-violeta px-4 text-sm font-medium text-violeta-texto hover:bg-violeta-tenue disabled:cursor-wait disabled:opacity-70"
            >
              {estado === "guardando"
                ? "Guardando…"
                : estado === "error"
                  ? "Reintentar"
                  : "Guardar en la cartilla"}
            </button>
            {estado === "error" && (
              <p role="alert" className="text-sm text-margen">
                <span aria-hidden="true">⚠ </span>No se pudo guardar.
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
}