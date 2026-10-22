import type { IssueResumen } from "@/server/github/buscarIssuesEnGithub";

const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const MS_POR_HORA = 1000 * 60 * 60;

type IssueCardProps = {
  issue: IssueResumen;
  guardado: boolean;
  onGuardar: () => void;
};

function haceCuanto(fechaIso: string): string {
  const diferenciaHoras = (new Date(fechaIso).getTime() - Date.now()) / MS_POR_HORA;
  if (Math.abs(diferenciaHoras) < 24) {
    return formatoRelativo.format(Math.round(diferenciaHoras), "hour");
  }
  return formatoRelativo.format(Math.round(diferenciaHoras / 24), "day");
}

export default function IssueCard({ issue, guardado, onGuardar }: IssueCardProps) {
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
      <button
        type="button"
        onClick={onGuardar}
        disabled={guardado}
        className="mt-3 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-default disabled:opacity-60 dark:border-gray-600 dark:hover:bg-gray-800"
      >
        {guardado ? "✓ Guardado" : "Guardar"}
      </button>
    </article>
  );
}

