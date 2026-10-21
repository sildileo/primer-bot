import { cookies } from "next/headers";

const COOKIE_VISITANTE = "primer_visitor_id";
const UN_ANIO_EN_SEGUNDOS = 60 * 60 * 24 * 365;

export async function obtenerVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  const existente = cookieStore.get(COOKIE_VISITANTE)?.value;
  if (existente) return existente;

  const nuevo = crypto.randomUUID();
  cookieStore.set(COOKIE_VISITANTE, nuevo, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UN_ANIO_EN_SEGUNDOS,
    path: "/",
  });
  return nuevo;
}