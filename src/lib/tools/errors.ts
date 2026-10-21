import { GitHubError } from "../github/errors"

export function errorParaElLLM(error: unknown) {
    if (error instanceof GitHubError) {
        return { 
            error: error.kind, 
            mensaje: error.message, 
            retryAfterSeconds: error.retryAfterSeconds }
    }
    throw error
}