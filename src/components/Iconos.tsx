type PropsIcono = { className?: string };

function Base({ className = "size-5", children }: PropsIcono & { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function IconoMenu(props: PropsIcono) {
  return <Base {...props}><path d="M4 7h16M4 12h16M4 17h16" /></Base>;
}

export function IconoCerrar(props: PropsIcono) {
  return <Base {...props}><path d="M6 6l12 12M18 6L6 18" /></Base>;
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