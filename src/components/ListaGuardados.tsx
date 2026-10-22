"use client";

import { useState } from "react";
import type { IssueGuardado } from "@/server/db/issuesGuardadosDb";
import { IconoCerrar } from "@/components/Iconos";

function ItemGuardado({
  issue,
  onQuitar,
}: {
  issue: IssueGuardado;
  onQuitar: (issue: IssueGuardado) => Promise<boolean>;
}) {
  const [estado, setEstado] = useState<"inicial" | "quitando" | "error">("inicial");

  async function alQuitar() {
    setEstado("quitando");
    const salioBien = await onQuitar(issue);
    if (!salioBien) setEstado("error");
    // si salió bien, el item desaparece de la lista: no hace falta tocar el estado
  }

  return (
    <li className="relative flex items-start gap-2 rounded-md border border-borde bg-superficie p-3 transition-colors has-[a:hover]:border-violeta has-[a:hover]:bg-violeta-tenue has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-violeta">
      <div className="min-w-0 flex-1">
        {issue.lenguaje && (
          <p className="mb-1.5 flex flex-wrap gap-1">
            <span className="sr-only">Lo encontraste buscando: </span>
            <span className="rounded bg-violeta-tenue px-1.5 py-0.5 font-mono text-[0.7rem] text-violeta-texto">
              {issue.lenguaje}
            </span>
            {issue.tema && (
              <span className="rounded border border-borde px-1.5 py-0.5 font-mono text-[0.7rem] text-tinta-suave">
                {issue.tema}
              </span>
            )}
          </p>
        )}
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium leading-snug text-violeta-texto focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
        >
          {issue.titulo}
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
        <p className="mt-1 break-words font-mono text-xs text-tinta-suave">{issue.repo}</p>
        {estado === "error" && (
          <p role="alert" className="mt-1 text-xs text-margen">
            <span aria-hidden="true">⚠ </span>No se pudo quitar.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={alQuitar}
        disabled={estado === "quitando"}
        aria-label={`Quitar «${issue.titulo}» de la cartilla`}
        className="relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-tinta-suave hover:bg-superficie hover:text-margen disabled:cursor-wait disabled:opacity-50"
      >
        <IconoCerrar className="size-4" />
      </button>
    </li>
  );
}

export default function ListaGuardados({
  guardados,
  onQuitar,
}: {
  guardados: IssueGuardado[];
  onQuitar: (issue: IssueGuardado) => Promise<boolean>;
}) {
  if (guardados.length === 0) {
    return (
      <p className="text-sm text-tinta-suave">
        Todavía está vacía. Guardá un issue desde una ficha o pedíselo a PRimer.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {guardados.map((issue) => (
        <ItemGuardado key={issue.url} issue={issue} onQuitar={onQuitar} />
      ))}
    </ul>
  );
}