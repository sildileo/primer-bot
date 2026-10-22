export default function EsqueletosFichas() {
  return (
    <div aria-hidden="true" className="my-4 grid gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-lg border border-borde bg-superficie py-4 pl-6 pr-4">
          <div className="h-4 w-3/4 rounded bg-cuadricula" />
          <div className="mt-3 h-3 w-1/2 rounded bg-cuadricula" />
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-28 rounded-full bg-cuadricula" />
            <div className="h-5 w-16 rounded-full bg-cuadricula" />
          </div>
        </div>
      ))}
    </div>
  );
}