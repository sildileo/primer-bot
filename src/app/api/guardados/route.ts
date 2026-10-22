import { obtenerVisitorId } from "@/server/seguridad/visitante";
import { guardarIssue, listarIssuesGuardados } from "@/server/db/issuesGuardadosDb";
import { GuardarIssueInputSchema } from "@/server/ia/toolsSchemas";
import { quitarIssue } from "@/server/db/issuesGuardadosDb";
import { QuitarIssueInputSchema } from "@/server/ia/toolsSchemas";
import { log } from "@/server/observabilidad/log";

export async function GET() {
    const visitorId = await obtenerVisitorId();
    try {
        return Response.json(await listarIssuesGuardados(visitorId));
    } catch {
        return Response.json({ error: "No se pudieron leer los issues guardados" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const visitorId = await obtenerVisitorId();

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const resultado = GuardarIssueInputSchema.safeParse(body);
    if (!resultado.success) {
        return Response.json({ error: "Datos inválidos" }, { status: 400 });
    }

    try {
        return Response.json(await guardarIssue(visitorId, resultado.data));
    } catch {
        return Response.json({ error: "No se pudo guardar el issue" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
  const visitorId = await obtenerVisitorId();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const resultado = QuitarIssueInputSchema.safeParse(body);
  if (!resultado.success) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    return Response.json(await quitarIssue(visitorId, resultado.data.url));
  } catch (error) {
    log("error", "guardados.quitar", { visitorId, error });
    return Response.json({ error: "No se pudo quitar el issue" }, { status: 500 });
  }
}