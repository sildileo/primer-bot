import { textoDeError } from "@/components/estadoChat";

export default function ErrorChat({ error, onReintentar }: { error: Error; onReintentar: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-margen/40 bg-superficie p-4">
      <p className="flex-1 text-sm">
        <span aria-hidden="true" className="mr-1.5 text-margen">⚠</span>
        {textoDeError(error)}
      </p>
      <button
        type="button"
        onClick={onReintentar}
        className="min-h-11 rounded-md border border-borde px-4 text-sm font-medium hover:border-violeta hover:text-violeta-texto"
      >
        Reintentar
      </button>
    </div>
  );
}