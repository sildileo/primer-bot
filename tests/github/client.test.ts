import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { githubFetch } from "@/lib/github/client";
import { GitHubError } from "@/lib/github/errors";

function respuesta(status: number, body: unknown = {}, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers });
}

const fetchFalso = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchFalso);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchFalso.mockReset();
});

async function capturarError(promesa: Promise<unknown>): Promise<GitHubError> {
  try {
    await promesa;
  } catch (error) {
    if (error instanceof GitHubError) return error;
    throw error;
  }
  throw new Error("Se esperaba un GitHubError y la función terminó bien");
}

describe("githubFetch", () => {
  it("devuelve el JSON cuando GitHub responde 200", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(200, { ok: true }));
    await expect(githubFetch("/algo")).resolves.toEqual({ ok: true });
  });

  it("clasifica 401 como error de autenticación", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(401));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("auth");
  });

  it("clasifica 403 como rate limit y calcula cuánto esperar", async () => {
    const reset = Math.floor(Date.now() / 1000) + 30;
    fetchFalso.mockResolvedValueOnce(respuesta(403, {}, { "x-ratelimit-reset": String(reset) }));

    const error = await capturarError(githubFetch("/algo"));

    expect(error.kind).toBe("rate_limit");
    expect(error.retryAfterSeconds).toBeGreaterThanOrEqual(29);
    expect(error.retryAfterSeconds).toBeLessThanOrEqual(30);
  });

  it("clasifica 429 como rate limit", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(429));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("rate_limit");
  });

  it("clasifica 422 como error de validación", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(422));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("validation");
  });

  it("clasifica 404 como recurso inexistente", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(404));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("not_found");
  });

  it("reintenta una vez ante un 500 y devuelve el resultado si el segundo intento sale bien", async () => {
    fetchFalso
      .mockResolvedValueOnce(respuesta(500))
      .mockResolvedValueOnce(respuesta(200, { ok: true }));

    await expect(githubFetch("/algo")).resolves.toEqual({ ok: true });
    expect(fetchFalso).toHaveBeenCalledTimes(2);
  });

  it("se rinde después de dos 500 seguidos", async () => {
    fetchFalso
      .mockResolvedValueOnce(respuesta(500))
      .mockResolvedValueOnce(respuesta(503));

    const error = await capturarError(githubFetch("/algo"));

    expect(error.kind).toBe("server");
    expect(fetchFalso).toHaveBeenCalledTimes(2);
  });

  it("clasifica un timeout", async () => {
    fetchFalso.mockRejectedValueOnce(new DOMException("Se agotó el tiempo", "TimeoutError"));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("timeout");
  });

  it("clasifica un error de red", async () => {
    fetchFalso.mockRejectedValueOnce(new TypeError("fetch failed"));
    const error = await capturarError(githubFetch("/algo"));
    expect(error.kind).toBe("network");
  });
});