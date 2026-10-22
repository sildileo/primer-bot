const VENTANA_MS = 60 * 1000;
const MAXIMO_POR_VENTANA = 10;

type Registro = { cantidad: number; inicioVentana: number };

const pedidosPorClave = new Map<string, Registro>();

export function verificarLimite(clave: string): { permitido: boolean; segundosParaReintentar: number } {
    const ahora = Date.now()
    const registro = pedidosPorClave.get(clave)

    if (!registro || ahora - registro.inicioVentana >= VENTANA_MS) {
        pedidosPorClave.set(clave, { cantidad: 1, inicioVentana: ahora });
        return { permitido: true, segundosParaReintentar: 0 };
    }

    if (registro.cantidad >= MAXIMO_POR_VENTANA) {
        const msRestantes = registro.inicioVentana + VENTANA_MS - ahora;
        return { permitido: false, segundosParaReintentar: Math.ceil(msRestantes / 1000) };
    }

    registro.cantidad += 1
    return { permitido: true, segundosParaReintentar: 0 }
}