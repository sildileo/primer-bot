import { z } from "zod";

export const BuscarIssuesInputSchema = z.object({
  lenguaje: z
    .string()
    .describe("Lenguaje de programación en minúsculas, por ejemplo: python, javascript, typescript"),
  tema: z
    .string()
    .optional()
    .describe("Tema o área de interés en una o dos palabras, por ejemplo: web, api, docs"),
});

export type BuscarIssuesInput = z.infer<typeof BuscarIssuesInputSchema>;