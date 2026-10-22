"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconoCerrar } from "@/components/Iconos";

type PanelLateralProps = {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
};

export default function PanelLateral({ abierto, onCerrar, titulo, children }: PanelLateralProps) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  // Sincronizamos el estado de React con el <dialog> del navegador
  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogoRef}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      onClick={(e) => {
        // clic en el fondo oscuro (fuera del contenido) = cerrar
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-[min(24rem,90vw)] max-w-none animate-entrar-panel border-l border-borde bg-papel p-0 text-tinta backdrop:bg-black/50"
    >
      <div className="flex h-full flex-col overflow-y-auto p-5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id={idTitulo} className="text-lg font-bold">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="inline-flex size-11 items-center justify-center rounded-md border border-borde bg-superficie hover:border-violeta"
          >
            <IconoCerrar />
          </button>
        </div>
        {abierto && children}
      </div>
    </dialog>
  );
}