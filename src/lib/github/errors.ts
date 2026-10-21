export type GitHubErrorKind =
  | "auth"
  | "rate_limit"
  | "validation"
  | "not_found"
  | "server"
  | "timeout"
  | "network";

export class GitHubError extends Error {
  constructor(
    public kind: GitHubErrorKind,
    message: string,
    public retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}