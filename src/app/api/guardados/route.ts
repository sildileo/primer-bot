import { obtenerVisitorId } from "@/lib/visitor";
import { listarIssuesGuardados } from "@/lib/db/savedIssues";

export async function GET() {
  const visitorId = await obtenerVisitorId();
  try {
    return Response.json(await listarIssuesGuardados(visitorId));
  } catch {
    return Response.json({ error: "No se pudieron leer los issues guardados" }, { status: 500 });
  }
}