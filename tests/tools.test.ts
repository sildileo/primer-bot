import { describe, it, expect } from "vitest";
import { BuscarIssuesInputSchema, GuardarIssueInputSchema } from "@/server/ia/toolsSchemas";
import { errorParaElLLM } from "@/server/ia/errorParaElLLM";
import { GitHubError } from "@/server/github/githubErrors";

describe("schemas de las tools", () => {
  it("buscarIssues acepta un lenguaje sin tema", () => {
    expect(BuscarIssuesInputSchema.safeParse({ lenguaje: "python" }).success).toBe(true);
  });

  it("buscarIssues rechaza un pedido sin lenguaje", () => {
    expect(BuscarIssuesInputSchema.safeParse({ tema: "web" }).success).toBe(false);
  });

  it("guardarIssue rechaza etiquetas que no son una lista", () => {
    const resultado = GuardarIssueInputSchema.safeParse({
      url: "https://github.com/a/b/issues/1",
      titulo: "Un issue",
      repo: "a/b",
      etiquetas: "docs",
    });
    expect(resultado.success).toBe(false);
  });
});

describe("errorParaElLLM", () => {
  it("convierte un GitHubError en un objeto que el LLM puede explicar", () => {
    const error = new GitHubError("rate_limit", "Se superó el límite", 25);
    expect(errorParaElLLM(error)).toEqual({
      error: "rate_limit",
      mensaje: "Se superó el límite",
      retryAfterSeconds: 25,
    });
  });

  it("vuelve a tirar los errores que no son de GitHub", () => {
    expect(() => errorParaElLLM(new Error("bug inesperado"))).toThrow("bug inesperado");
  });
});