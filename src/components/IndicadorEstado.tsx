export default function IndicadorEstado({ texto }: { texto: string }) {
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-tinta-suave">
      <span aria-hidden="true" className="flex gap-1">
        {[0, 150, 300].map((demora) => (
          <span
            key={demora}
            className="size-1.5 animate-punto rounded-full bg-violeta"
            style={{ animationDelay: `${demora}ms` }}
          />
        ))}
      </span>
      {texto}
    </p>
  );
}