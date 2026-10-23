import { createHmac, timingSafeEqual } from "node:crypto";

function calcularFirma(id: string, secreto: string): string {
  return createHmac("sha256", secreto).update(id).digest("base64url");
}

export function crearValorFirmado(id: string, secreto: string): string {
  return `${id}.${calcularFirma(id, secreto)}`;
}

/** Devuelve el id si la firma es válida, o null si fue alterada o no tiene firma. */
export function verificarValorFirmado(valor: string, secreto: string): string | null {
  const posicionPunto = valor.lastIndexOf(".");
  if (posicionPunto === -1) return null;

  const id = valor.slice(0, posicionPunto);
  const firmaRecibida = Buffer.from(valor.slice(posicionPunto + 1));
  const firmaEsperada = Buffer.from(calcularFirma(id, secreto));

  if (firmaRecibida.length !== firmaEsperada.length) return null;
  if (!timingSafeEqual(firmaRecibida, firmaEsperada)) return null;

  return id;
}