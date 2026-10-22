import { supabase } from "./supabase";

export type IssueGuardado = {
    url: string;
    titulo: string;
    repo: string;
    etiquetas: string[];
    lenguaje?: string | null;
    tema?: string | null;
};

export async function guardarIssue(visitorId: string, issue: IssueGuardado) {

    const { error } = await supabase.from("saved_issues").insert(
        {
            visitor_id: visitorId,
            issue_url: issue.url,
            title: issue.titulo,
            repo: issue.repo,
            labels: issue.etiquetas,
            lenguaje: issue.lenguaje ?? null,
            tema: issue.tema ?? null,
        })

    if (error) {
        if (error.code === "23505") {
            return { guardado: false, motivo: "ya estaba guardado" }
        }
        throw new Error("No se pudo guardar el issue: " + error.message)
    }

    return { guardado: true }
}



export async function listarIssuesGuardados(visitorId: string): Promise<IssueGuardado[]> {

    const { data, error } = await supabase
        .from("saved_issues")
        .select("*")
        .eq("visitor_id", visitorId)
        .order("created_at", { ascending: false })

    if (error) {
        throw new Error("No se pudieron leer los issues guardados: " + error.message)
    }

    return data.map((fila) => ({
        url: fila.issue_url,
        titulo: fila.title,
        repo: fila.repo,
        etiquetas: fila.labels,
        lenguaje: fila.lenguaje,
        tema: fila.tema,
    }))
}

export async function quitarIssue(visitorId: string, url: string) {
    const { data, error } = await supabase
        .from("saved_issues")
        .delete()
        .eq("visitor_id", visitorId)
        .eq("issue_url", url)
        .select("id");

    if (error) {
        throw new Error("No se pudo quitar el issue: " + error.message);
    }

    return data.length > 0
        ? { quitado: true }
        : { quitado: false, motivo: "no estaba en la cartilla" };
}