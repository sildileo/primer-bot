type Nivel = "info" | "warn" | "error";

function serializarError(error: unknown) {
  if (error instanceof Error) {
    return { nombre: error.name, mensaje: error.message, stack: error.stack };
  }
  return error;
}

export function log(nivel: Nivel, evento: string, datos: Record<string, unknown> = {}) {
  const entrada: Record<string, unknown> = {
    momento: new Date().toISOString(),
    nivel,
    evento,
    ...datos,
  };
  if ("error" in datos) {
    entrada.error = serializarError(datos.error);
  }

  const linea = JSON.stringify(entrada);
  if (nivel === "error") console.error(linea);
  else if (nivel === "warn") console.warn(linea);
  else console.log(linea);
}