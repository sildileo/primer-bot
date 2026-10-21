import { tool } from "ai";
import { searchIssues } from "@/lib/github/searchIssues";
import { BuscarIssuesInputSchema } from "./schemas";
import { errorParaElLLM } from "./errors";

export const buscarIssues = tool({
    description:
        "Busca en GitHub issues abiertos aptos para principiantes (good first issue) según el lenguaje de programación y, opcionalmente, un tema de interés.",
    inputSchema: BuscarIssuesInputSchema,
    execute: async ({ lenguaje, tema }) => {
        try {
            return await searchIssues( {lenguaje, tema} )
        }
        catch (error) {
            return errorParaElLLM(error)
        }
    }
})