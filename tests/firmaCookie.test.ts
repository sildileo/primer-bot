import { describe, it, expect } from "vitest";
import { crearValorFirmado, verificarValorFirmado } from "@/server/seguridad/firmaCookie";

const SECRETO = "clave-de-prueba-de-al-menos-32-caracteres";
const ID = "3f2a9c1e-1111-4222-8333-444455556666";

describe("firma de la cookie del visitante", () => {
  it("acepta un valor firmado por el servidor y devuelve el id", () => {
    const valor = crearValorFirmado(ID, SECRETO);
    expect(verificarValorFirmado(valor, SECRETO)).toBe(ID);
  });

  it("rechaza un id cambiado a mano (la firma ya no coincide)", () => {
    const valor = crearValorFirmado(ID, SECRETO);
    const firma = valor.split(".")[1];
    const alterado = `otro-id-adivinado.${firma}`;
    expect(verificarValorFirmado(alterado, SECRETO)).toBeNull();
  });

  it("rechaza una cookie vieja sin firma", () => {
    expect(verificarValorFirmado(ID, SECRETO)).toBeNull();
  });

  it("rechaza un valor firmado con otra clave", () => {
    const valor = crearValorFirmado(ID, "otra-clave-distinta-de-32-caracteres-xx");
    expect(verificarValorFirmado(valor, SECRETO)).toBeNull();
  });
});