import { tool } from "ai";
import { searchIssues } from "@/server/github/buscarIssuesEnGithub";
import { BuscarIssuesInputSchema } from "./toolsSchemas";
import { errorParaElLLM } from "./errorParaElLLM";

export const buscarIssues = tool({
    description:
        "Busca en GitHub issues abiertos aptos para principiantes (good first issue) según el lenguaje de programación y, opcionalmente, un tema de interés.",
    inputSchema: BuscarIssuesInputSchema,
    execute: async ({ lenguaje, tema, pagina }) => {
        try {
            return await searchIssues({ lenguaje, tema, pagina });
        }
        catch (error) {
            return errorParaElLLM(error)
        }
    }
})