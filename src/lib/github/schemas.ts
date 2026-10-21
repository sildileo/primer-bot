import { z } from "zod";

// Solo declaramos los campos que usamos.
// Zod descarta el resto (user, reactions, URLs, etc.) al validar.

export const GitHubIssueSchema = z.object({
  title: z.string(),
  html_url: z.string(),
  repository_url: z.string(),
  state: z.string(),
  labels: z.array(z.object({ name: z.string() })),
  assignee: z.unknown().nullable(), // solo nos importa si hay o no
  comments: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  body: z.string().nullable(),
});

export const GitHubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(GitHubIssueSchema),
});

export type GitHubIssue = z.infer<typeof GitHubIssueSchema>;
export type GitHubSearchResponse = z.infer<typeof GitHubSearchResponseSchema>;