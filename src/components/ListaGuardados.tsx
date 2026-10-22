import type { IssueGuardado } from "@/server/db/issuesGuardadosDb";

export default function ListaGuardados({ guardados }: { guardados: IssueGuardado[] }) {
  if (guardados.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Todavía no guardaste issues. Tocá «Guardar» en una tarjeta o pedile al bot que te guarde uno.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {guardados.map((issue) => (
        <li key={issue.url} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {issue.titulo}
          </a>
          <p className="mt-1 text-xs text-gray-500">{issue.repo}</p>
        </li>
      ))}
    </ul>
  );
}