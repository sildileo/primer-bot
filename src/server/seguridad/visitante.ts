import { cookies } from "next/headers";
import { crearValorFirmado, verificarValorFirmado } from "./firmaCookie";

const COOKIE_VISITANTE = "primer_visitor_id";
const UN_ANIO_EN_SEGUNDOS = 60 * 60 * 24 * 365;
const LARGO_MINIMO_SECRETO = 32;

function obtenerSecreto(): string {
  const secreto = process.env.VISITOR_COOKIE_SECRET;
  if (!secreto || secreto.length < LARGO_MINIMO_SECRETO) {
    throw new Error("Falta VISITOR_COOKIE_SECRET o es demasiado corta (mínimo 32 caracteres)");
  }
  return secreto;
}

/** Lee el visitante sin crearlo. Si la cookie no existe o fue alterada, devuelve null. */
export async function leerVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const valor = cookieStore.get(COOKIE_VISITANTE)?.value;
  if (!valor) return null;
  return verificarValorFirmado(valor, obtenerSecreto());
}

/** Devuelve el visitante actual, o crea uno nuevo con su cookie firmada. */
export async function obtenerVisitorId(): Promise<string> {
  const existente = await leerVisitorId();
  if (existente) return existente;

  const nuevo = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_VISITANTE, crearValorFirmado(nuevo, obtenerSecreto()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UN_ANIO_EN_SEGUNDOS,
    path: "/",
  });
  return nuevo;
}