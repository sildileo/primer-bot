"use client";

import { useEffect, useId, useRef } from "react";
import { LARGO_MAXIMO_MENSAJE } from "@/compartido/pedidoChat";
import { IconoDetener, IconoEnviar } from "@/components/Iconos";

const ALTO_MAXIMO_PX = 200;
const AVISAR_DESDE = LARGO_MAXIMO_MENSAJE * 0.8;

type CompositorProps = {
  valor: string;
  onCambiar: (valor: string) => void;
  onEnviar: () => void;
  onDetener: () => void;
  cargando: boolean;
};

export default function Compositor({ valor, onCambiar, onEnviar, onDetener, cargando }: CompositorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idAyuda = useId();
  const idContador = useId();

  // El textarea crece con el texto, hasta un máximo
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, ALTO_MAXIMO_PX)}px`;
  }, [valor]);

  const vacio = valor.trim().length === 0;
  const mostrarContador = valor.length >= AVISAR_DESDE;

  return (
    <form
      className="sticky bottom-0 bg-papel pb-6 pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!cargando) onEnviar();
      }}
    >
      <div className="flex items-end gap-2 rounded-xl border border-borde bg-superficie p-2 shadow-sm focus-within:border-violeta">
        <textarea
          ref={textareaRef}
          rows={1}
          value={valor}
          maxLength={LARGO_MAXIMO_MENSAJE}
          onChange={(e) => onCambiar(e.currentTarget.value)}
          onKeyDown={(e) => {
            // Enter envía; Shift+Enter hace salto de línea.
            // isComposing: no enviar mientras se escribe un acento o con teclados de otros idiomas
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              if (!cargando && !vacio) onEnviar();
            }
          }}
          placeholder="Contame qué lenguajes sabés y qué te interesa…"
          aria-label="Mensaje para PRimer"
          aria-describedby={`${idAyuda} ${idContador}`}
          className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-2.5 text-tinta placeholder:text-tinta-suave focus:outline-none"
        />

        {cargando ? (
          <button
            type="button"
            onClick={onDetener}
            aria-label="Detener respuesta"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-borde text-tinta hover:border-margen hover:text-margen"
          >
            <IconoDetener />
          </button>
        ) : (
          <button
            type="submit"
            disabled={vacio}
            aria-label="Enviar mensaje"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-violeta text-white hover:bg-violeta-texto disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconoEnviar />
          </button>
        )}
      </div>

      <div className="mt-1.5 flex justify-between gap-4 px-1 text-xs text-tinta-suave">
        <p id={idAyuda}>Enter para enviar · Shift + Enter para un salto de línea</p>
        <p id={idContador} aria-live="polite" className={mostrarContador ? "" : "sr-only"}>
          {mostrarContador ? `${valor.length} de ${LARGO_MAXIMO_MENSAJE} caracteres` : ""}
        </p>
      </div>
    </form>
  );
}