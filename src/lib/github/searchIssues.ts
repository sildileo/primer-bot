import { githubFetch } from "./client";
import { GitHubError } from "./errors";
import { GitHubSearchResponseSchema } from "./schemas";

export async function searchIssues(filtros: { lenguaje: string; tema?: string }) {

    let query = `is:issue state:open no:assignee label:"good first issue" language:${filtros.lenguaje}`

    if (filtros.tema) {
        query += ` ${filtros.tema}`
    }

    const queryCodificada = encodeURIComponent(query)
    const url = "/search/issues?q=" + queryCodificada + "&sort=updated&per_page=20"

    const json = await githubFetch(url)
    const resultado = GitHubSearchResponseSchema.safeParse(json)

    if (!resultado.success) {
        throw new GitHubError("invalid_response", "Respuesta inválida del lado de GitHub")
    }

    return resultado.data.items
}