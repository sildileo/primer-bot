import { obtenerVisitorId } from "@/lib/visitor";
import { guardarIssue, listarIssuesGuardados } from "@/lib/db/savedIssues";
import { GuardarIssueInputSchema } from "@/lib/tools/schemas";

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