import { GitHubError } from "./githubErrors"

export async function githubFetch(path: string, intento = 1): Promise<unknown> {
    const destino = "https://api.github.com" + path

    let response: Response;

    try {
        response = await fetch(destino, {
            headers: {
                Authorization: "Bearer " + process.env.GITHUB_TOKEN,
                Accept: "application/vnd.github+json",
            },
            signal: AbortSignal.timeout(8000)
        })
    } catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            throw new GitHubError("timeout", "Se agotó el tiempo límite de respuesta")
        } else {
            throw new GitHubError("network", "No se pudo conectar con GitHub")
        }
    }

    if (!response.ok) {

        if (response.status >= 500 && intento < 2) return githubFetch(path, intento + 1)

        switch (response.status) {
            case 401:
                throw new GitHubError("auth", "Token de GitHub inválido o vencido")

            case 403:
            case 429: {
                const reset = Number(response.headers.get("x-ratelimit-reset"))
                const ahora = Math.floor(Date.now() / 1000)
                const segundosParaReintento = reset - ahora

                throw new GitHubError("rate_limit", "Se superó el límite de pedidos a GitHub", segundosParaReintento)
            }

            case 422:
                throw new GitHubError("validation", "GitHub rechazó los parámetros de la búsqueda")

            case 404:
                throw new GitHubError("not_found", "El recurso pedido no existe en GitHub")

            default:
                throw new GitHubError("server", "GitHub respondió " + response.status)
        }

    }

    return await response.json()
}