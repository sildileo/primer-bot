import { z } from "zod";

export const BuscarIssuesInputSchema = z.object({
  lenguaje: z
    .string()
    .describe("Lenguaje de programación en minúsculas, por ejemplo: python, javascript, typescript"),
  tema: z
    .string()
    .optional()
    .describe("Tema o área de interés en una o dos palabras, por ejemplo: web, api, docs"),
  pagina: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe("Página de resultados. Usá 2, 3, etc. cuando el usuario pida más o distintos issues de la misma búsqueda."),
})

export type BuscarIssuesInput = z.infer<typeof BuscarIssuesInputSchema>

export const GuardarIssueInputSchema = z.object({
  url: z.string().describe("URL del issue en GitHub, tal como vino en los resultados de búsqueda"),
  titulo: z.string().describe("Título del issue"),
  repo: z.string().describe("Repositorio en formato dueño/repo"),
  etiquetas: z.array(z.string()).describe("Nombres de las etiquetas del issue"),
  lenguaje: z.string().nullish().describe("Lenguaje de la búsqueda, copiado de los resultados"),
  tema: z.string().nullish().describe("Tema de la búsqueda, copiado de los resultados (puede ser null)"),
})

export const QuitarIssueInputSchema = z.object({
  url: z.string().describe("URL del issue en GitHub, tal como aparece en la cartilla"),
});

export const VerGuardadosInputSchema = z.object({})