import type { IssueGuardado } from "@/server/db/issuesGuardadosDb";

export default function ListaGuardados({ guardados }: { guardados: IssueGuardado[] }) {
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
        <li key={issue.url} className="rounded-md border border-borde bg-superficie p-3">
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium leading-snug text-violeta-texto underline-offset-2 hover:underline"
          >
            {issue.titulo}
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
          <p className="mt-1 font-mono text-xs text-tinta-suave">{issue.repo}</p>
        </li>
      ))}
    </ul>
  );
}