import type { IssueResumen } from "@/lib/github/searchIssues";

const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const MS_POR_HORA = 1000 * 60 * 60;

function haceCuanto(fechaIso: string): string {
  const diferenciaHoras = (new Date(fechaIso).getTime() - Date.now()) / MS_POR_HORA;
  if (Math.abs(diferenciaHoras) < 24) {
    return formatoRelativo.format(Math.round(diferenciaHoras), "hour");
  }
  return formatoRelativo.format(Math.round(diferenciaHoras / 24), "day");
}

export default function IssueCard({ issue }: { issue: IssueResumen }) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <a
        href={issue.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
      >
        {issue.titulo}
      </a>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {issue.repo} · {issue.comentarios} comentarios · actualizado {haceCuanto(issue.actualizado)}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1" aria-label="Etiquetas">
        {issue.etiquetas.map((etiqueta) => (
          <li
            key={etiqueta}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {etiqueta}
          </li>
        ))}
      </ul>
    </article>
  );
}