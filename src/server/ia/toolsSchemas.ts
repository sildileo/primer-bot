import { z } from "zod";

export const BuscarIssuesInputSchema = z.object({
  lenguaje: z
    .string()
    .describe("Lenguaje de programación en minúsculas, por ejemplo: python, javascript, typescript"),
  tema: z
    .string()
    .optional()
    .describe("Tema o área de interés en una o dos palabras, por ejemplo: web, api, docs"),
})

export type BuscarIssuesInput = z.infer<typeof BuscarIssuesInputSchema>

export const GuardarIssueInputSchema = z.object({
  url: z.string().describe("URL del issue en GitHub, tal como vino en los resultados de búsqueda"),
  titulo: z.string().describe("Título del issue"),
  repo: z.string().describe("Repositorio en formato dueño/repo"),
  etiquetas: z.array(z.string()).describe("Nombres de las etiquetas del issue"),
})

export const QuitarIssueInputSchema = z.object({
  url: z.string().describe("URL del issue en GitHub, tal como aparece en la cartilla"),
});

export const VerGuardadosInputSchema = z.object({})