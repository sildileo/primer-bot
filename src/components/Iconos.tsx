type PropsIcono = { className?: string };

function Base({
  className = "size-5",
  grosor = 2,
  relleno = false,
  children,
}: PropsIcono & { grosor?: number; relleno?: boolean; children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill={relleno ? "currentColor" : "none"}
      fillOpacity={relleno ? 1 : undefined}
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function IconoPulgarArriba({ relleno, ...props }: PropsIcono & { relleno?: boolean }) {
  return (
    <Base {...props} relleno={relleno}>
      <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3" />
    </Base>
  );
}

export function IconoPulgarAbajo({ relleno, ...props }: PropsIcono & { relleno?: boolean }) {
  return (
    <Base {...props} relleno={relleno}>
      <path d="M7 13V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2-2l-1-5a2 3 0 0 0-2-2h-7a3 3 0 0 0-3 3" />
    </Base>
  );
}

export function IconoCerrar(props: PropsIcono) {
    return <Base {...props} grosor={2.5}><path d="M6 6l12 12M18 6L6 18" /></Base>;
}

export function IconoMenu(props: PropsIcono) {
    return <Base {...props}><path d="M4 7h16M4 12h16M4 17h16" /></Base>;
}

export function IconoAjustes(props: PropsIcono) {
    return (
        <Base {...props}>
            <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="18" r="2" />
        </Base>
    );
}

export function IconoEnviar(props: PropsIcono) {
    return <Base {...props}><path d="M12 19V5M5 12l7-7 7 7" /></Base>;
}

export function IconoDetener(props: PropsIcono) {
    return <Base {...props}><rect x="6" y="6" width="12" height="12" rx="2" /></Base>;
}

export function IconoNuevo(props: PropsIcono) {
  return <Base {...props}><path d="M12 5v14M5 12h14" /></Base>;
}