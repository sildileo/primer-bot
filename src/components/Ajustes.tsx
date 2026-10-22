"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

type Tamano = "normal" | "grande" | "muy-grande";
type Movimiento = "sistema" | "reducido";
type AjustesGuardados = { tamano?: Tamano; movimiento?: Movimiento };

const CLAVE = "primer-ajustes";

function leerAjustes(): AjustesGuardados {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "{}");
  } catch {
    return {};
  }
}

function guardarAjustes(cambios: AjustesGuardados) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...leerAjustes(), ...cambios }));
  } catch {
    // si localStorage está bloqueado, el ajuste vale solo hasta recargar
  }
}

type Opcion<T extends string> = { valor: T; etiqueta: string };

function GrupoOpciones<T extends string>({
  leyenda,
  nombre,
  opciones,
  valor,
  onCambiar,
}: {
  leyenda: string;
  nombre: string;
  opciones: Opcion<T>[];
  valor: T;
  onCambiar: (valor: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{leyenda}</legend>
      <div className="grid grid-cols-3 gap-2">
        {opciones.map((opcion) => (
          <label key={opcion.valor} className="cursor-pointer">
            <input
              type="radio"
              name={nombre}
              value={opcion.valor}
              checked={valor === opcion.valor}
              onChange={() => onCambiar(opcion.valor)}
              className="peer sr-only"
            />
            <span className="flex min-h-11 items-center justify-center gap-1 rounded-md border border-borde bg-superficie px-2 text-center text-sm peer-checked:border-violeta peer-checked:bg-violeta-tenue peer-checked:font-semibold peer-checked:text-violeta-texto peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violeta">
              {valor === opcion.valor && <span aria-hidden="true">✓</span>}
              {opcion.etiqueta}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Ajustes() {
  const { theme, setTheme } = useTheme();
  const [tamano, setTamano] = useState<Tamano>(() => leerAjustes().tamano ?? "normal");
  const [movimiento, setMovimiento] = useState<Movimiento>(() => leerAjustes().movimiento ?? "sistema");

  function cambiarTamano(valor: Tamano) {
    setTamano(valor);
    document.documentElement.dataset.tamano = valor;
    guardarAjustes({ tamano: valor });
  }

  function cambiarMovimiento(valor: Movimiento) {
    setMovimiento(valor);
    document.documentElement.dataset.movimiento = valor;
    guardarAjustes({ movimiento: valor });
  }

  return (
    <div className="flex flex-col gap-6">
      <GrupoOpciones
        leyenda="Tamaño de letra"
        nombre="tamano"
        valor={tamano}
        onCambiar={cambiarTamano}
        opciones={[
          { valor: "normal", etiqueta: "Normal" },
          { valor: "grande", etiqueta: "Grande" },
          { valor: "muy-grande", etiqueta: "Muy grande" },
        ]}
      />
      <GrupoOpciones
        leyenda="Tema"
        nombre="tema"
        valor={(theme ?? "system") as "system" | "light" | "dark"}
        onCambiar={setTheme}
        opciones={[
          { valor: "system", etiqueta: "Sistema" },
          { valor: "light", etiqueta: "Claro" },
          { valor: "dark", etiqueta: "Oscuro" },
        ]}
      />
      <GrupoOpciones
        leyenda="Animaciones"
        nombre="movimiento"
        valor={movimiento}
        onCambiar={cambiarMovimiento}
        opciones={[
          { valor: "sistema", etiqueta: "Según el sistema" },
          { valor: "reducido", etiqueta: "Reducidas" },
        ]}
      />
    </div>
  );
}