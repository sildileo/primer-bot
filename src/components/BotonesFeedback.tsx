"use client";

import { useState } from "react";
import type { ValorFeedback } from "@/compartido/feedback";
import { IconoPulgarAbajo, IconoPulgarArriba } from "@/components/Iconos";

type Props = { mensajeId: string; inicial: ValorFeedback };

export default function BotonesFeedback({ mensajeId, inicial }: Props) {
    const [valor, setValor] = useState<ValorFeedback>(inicial);
    const [aviso, setAviso] = useState("");
    const [fallo, setFallo] = useState(false);

    async function votar(voto: 1 | -1) {
        const anterior = valor;
        const nuevo = valor === voto ? null : voto; // tocar el mismo botón saca el voto
        setValor(nuevo); // optimista: se marca al instante
        setFallo(false);

        try {
            const respuesta = await fetch(`/api/mensajes/${encodeURIComponent(mensajeId)}/feedback`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valor: nuevo }),
            });
            if (!respuesta.ok) throw new Error();
            setAviso(nuevo === null ? "Quitaste tu voto." : "¡Gracias por tu opinión!");
        } catch {
            setValor(anterior); // si falló, volvemos a como estaba
            setFallo(true);
            setAviso("No se pudo guardar tu voto. Probá de nuevo.");
        }
    }

    function clases(activo: boolean) {
        return `inline-flex size-11 items-center justify-center rounded-md hover:text-violeta-texto ${activo ? "text-violeta-texto" : "text-tinta-suave"
            }`;
    }

    return (
        <div className="flex items-center gap-1">
            <button type="button" onClick={() => votar(1)} aria-pressed={valor === 1} aria-label="Me sirvió" className={clases(valor === 1)}>
                <IconoPulgarArriba relleno={valor === 1} />
            </button>
            <button type="button" onClick={() => votar(-1)} aria-pressed={valor === -1} aria-label="No me sirvió" className={clases(valor === -1)}>
                <IconoPulgarAbajo relleno={valor === -1} />
            </button>
            <p role="status" className={fallo ? "ml-2 text-xs text-margen" : "sr-only"}>
                {fallo && <span aria-hidden="true">⚠ </span>}
                {aviso}
            </p>
        </div>
    );
}