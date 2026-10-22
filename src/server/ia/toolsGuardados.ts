import { tool } from "ai";
import { GuardarIssueInputSchema, VerGuardadosInputSchema } from "./toolsSchemas";
import { guardarIssue as guardarEnDb, listarIssuesGuardados } from "@/server/db/issuesGuardadosDb";
import { log } from "../observabilidad/log";
import { QuitarIssueInputSchema } from "./toolsSchemas";
import { quitarIssue as quitarDeDb } from "@/server/db/issuesGuardadosDb";

export function crearToolsDeGuardados(visitorId: string) {
  return {
    guardarIssue: tool({
      description: "Cuando el usuario pide guardar, anotar o recordar un issue.",           // CUÁNDO usarla
      inputSchema: GuardarIssueInputSchema,
      execute: async (issue) => {
        try {
          return await guardarEnDb(visitorId, issue)
        }
        catch (error) {
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
        catch (error) {
          log("error", "tool.ver_guardados", { visitorId, error });
          return { error: "base_de_datos", mensaje: "No se pudo acceder a los issues guardados" }
        }
      },
    }),
    quitarIssue: tool({
      description:
        "Quita un issue de la lista personal del usuario en PRimer. " +
        "Usala cuando pida sacar, quitar, borrar o eliminar un issue de su cartilla. " +
        "Si no sabés la URL exacta, primero usá verGuardados.",
      inputSchema: QuitarIssueInputSchema,
      execute: async ({ url }) => {
        try {
          return await quitarDeDb(visitorId, url);
        } catch (error) {
          log("error", "tool.quitar_issue", { visitorId, error });
          return { error: "base_de_datos", mensaje: "No se pudo quitar el issue" };
        }
      },
    }),
  };
}