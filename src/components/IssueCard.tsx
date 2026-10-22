import type { IssueResumen } from "@/server/github/buscarIssuesEnGithub";

const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const MS_POR_HORA = 1000 * 60 * 60;

function haceCuanto(fechaIso: string): string {
  const diferenciaHoras = (new Date(fechaIso).getTime() - Date.now()) / MS_POR_HORA;
  if (Math.abs(diferenciaHoras) < 24) {
    return formatoRelativo.format(Math.round(diferenciaHoras), "hour");
  }
  return formatoRelativo.format(Math.round(diferenciaHoras / 24), "day");
}

type IssueCardProps = {
  issue: IssueResumen;
  guardado: boolean;
  onGuardar: () => void;
};

export default function IssueCard({ issue, guardado, onGuardar }: IssueCardProps) {
  return (
    <article className="relative rounded-lg border border-borde bg-superficie py-4 pl-6 pr-4 shadow-sm">
      {/* El borde violeta de la ficha: decorativo */}
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

      <div className="mt-4">
        {guardado ? (
          <p className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-violeta-texto">
            <span aria-hidden="true">✓</span> En tu cartilla
          </p>
        ) : (
          <button
            type="button"
            onClick={onGuardar}
            className="min-h-11 rounded-md border border-violeta px-4 text-sm font-medium text-violeta-texto hover:bg-violeta-tenue"
          >
            Guardar en la cartilla
          </button>
        )}
      </div>
    </article>
  );
}