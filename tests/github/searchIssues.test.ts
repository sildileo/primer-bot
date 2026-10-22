import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchIssues } from "@/lib/github/searchIssues";
import { githubFetch } from "@/lib/github/client";
import { GitHubError } from "@/lib/github/errors";

vi.mock("@/lib/github/client", () => ({ githubFetch: vi.fn() }));

vi.mock("./client", () => ({ githubFetch: vi.fn() }));

const githubFetchFalso = vi.mocked(githubFetch);
const DIA_MS = 24 * 60 * 60 * 1000;

function crearIssue(cambios: Record<string, unknown> = {}) {
  return {
    title: "Arreglar un typo en el README",
    html_url: "https://github.com/dueño/repo/issues/1",
    repository_url: "https://api.github.com/repos/dueño/repo",
    state: "open",
    labels: [{ name: "good first issue" }, { name: "docs" }],
    assignee: null,
    comments: 2,
    created_at: new Date(Date.now() - 10 * DIA_MS).toISOString(),
    updated_at: new Date(Date.now() - 1 * DIA_MS).toISOString(),
    body: "Descripción del issue",
    ...cambios,
  };
}

function respuestaDeBusqueda(items: unknown[]) {
  return { total_count: items.length, incomplete_results: false, items };
}

function queryEnviada(): string | null {
  const path = githubFetchFalso.mock.calls[0][0];
  return new URL("https://api.github.com" + path).searchParams.get("q");
}

beforeEach(() => {
  githubFetchFalso.mockReset();
});

describe("searchIssues", () => {
  it("arma la query con el lenguaje y el tema", async () => {
    githubFetchFalso.mockResolvedValueOnce(respuestaDeBusqueda([]));

    await searchIssues({ lenguaje: "python", tema: "api" });

    expect(queryEnviada()).toBe(
      'is:issue state:open no:assignee label:"good first issue" language:python api',
    );
  });

  it("arma la query sin tema cuando no viene", async () => {
    githubFetchFalso.mockResolvedValueOnce(respuestaDeBusqueda([]));

    await searchIssues({ lenguaje: "rust" });

    expect(queryEnviada()).toBe('is:issue state:open no:assignee label:"good first issue" language:rust');
  });

  it("achica cada issue a los campos que usa la app", async () => {
    githubFetchFalso.mockResolvedValueOnce(respuestaDeBusqueda([crearIssue()]));

    const [issue] = await searchIssues({ lenguaje: "python" });

    expect(issue).toEqual({
      titulo: "Arreglar un typo en el README",
      url: "https://github.com/dueño/repo/issues/1",
      repo: "dueño/repo",
      etiquetas: ["good first issue", "docs"],
      comentarios: 2,
      actualizado: expect.any(String),
      resumen: "Descripción del issue",
    });
  });

  it("descarta issues asignados", async () => {
    githubFetchFalso.mockResolvedValueOnce(
      respuestaDeBusqueda([crearIssue({ assignee: { login: "alguien" } })]),
    );

    await expect(searchIssues({ lenguaje: "python" })).resolves.toEqual([]);
  });

  it("descarta issues sin actividad en los últimos 6 meses", async () => {
    githubFetchFalso.mockResolvedValueOnce(
      respuestaDeBusqueda([crearIssue({ updated_at: new Date(Date.now() - 200 * DIA_MS).toISOString() })]),
    );

    await expect(searchIssues({ lenguaje: "python" })).resolves.toEqual([]);
  });

  it("devuelve como máximo 5 issues", async () => {
    const muchos = Array.from({ length: 8 }, (_, i) =>
      crearIssue({ html_url: `https://github.com/dueño/repo/issues/${i}` }),
    );
    githubFetchFalso.mockResolvedValueOnce(respuestaDeBusqueda(muchos));

    const issues = await searchIssues({ lenguaje: "python" });

    expect(issues).toHaveLength(5);
  });

  it("recorta el resumen a 300 caracteres y tolera un body nulo", async () => {
    githubFetchFalso.mockResolvedValueOnce(
      respuestaDeBusqueda([
        crearIssue({ body: "a".repeat(1000) }),
        crearIssue({ html_url: "https://github.com/dueño/repo/issues/2", body: null }),
      ]),
    );

    const [largo, sinBody] = await searchIssues({ lenguaje: "python" });

    expect(largo.resumen).toHaveLength(300);
    expect(sinBody.resumen).toBe("");
  });

  it("tira invalid_response si GitHub devuelve algo con otro formato", async () => {
    githubFetchFalso.mockResolvedValueOnce({ cualquier: "cosa" });

    await expect(searchIssues({ lenguaje: "python" })).rejects.toMatchObject({
      kind: "invalid_response",
    });
    await expect(searchIssues({ lenguaje: "python" })).rejects.toBeInstanceOf(GitHubError);
  });
});