import { githubFetch } from "./githubClient";
import { GitHubError } from "./githubErrors";
import { GitHubSearchResponseSchema } from "./githubSchemas";

const SEIS_MESES_MS = 180 * 24 * 60 * 60 * 1000

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

    const limite = Date.now() - SEIS_MESES_MS

    const issues = resultado.data.items
        .filter(issue => 
            issue.assignee === null && 
            new Date(issue.updated_at).getTime() > limite
        )
        .map(issue => ({
            titulo: issue.title,
            url: issue.html_url,
            repo: issue.repository_url.replace("https://api.github.com/repos/", ""),
            etiquetas: issue.labels.map(label => label.name),
            comentarios: issue.comments,
            actualizado: issue.updated_at,
            resumen: (issue.body ?? "").slice(0, 300),
        }))
        .slice(0, 5)

    return issues
}

export type IssueResumen = Awaited<ReturnType<typeof searchIssues>>[number];