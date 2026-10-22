import { tool } from "ai";
import { GuardarIssueInputSchema, VerGuardadosInputSchema } from "./toolsSchemas";
import { guardarIssue as guardarEnDb, listarIssuesGuardados } from "@/server/db/issuesGuardadosDb";
import { log } from "../observabilidad/log";

export function crearToolsDeGuardados(visitorId: string) {
  return {
    guardarIssue: tool({
      description: "Cuando el usuario pide guardar, anotar o recordar un issue.",           // CUÁNDO usarla
      inputSchema: GuardarIssueInputSchema,
      execute: async (issue) => {
        try {
            return await guardarEnDb(visitorId, issue)
        }
        catch (error){
            log("error", "tool.guardar_issue", { visitorId, error });
            return { error: "base_de_datos", mensaje: "No se pudo acceder a los issues guardados" }
        }
      },
    }),
    verGuardados: tool({
      description: "Cuando el usuario pregunta algo acerca de sus issues guardados.",
      inputSchema: VerGuardadosInputSchema,
      execute: async () => {
        try {
            return listarIssuesGuardados(visitorId)
        }
        catch (error){
            log("error", "tool.ver_guardados", { visitorId, error });
            return { error: "base_de_datos", mensaje: "No se pudo acceder a los issues guardados" }
        }
      },
    }),
  };
}