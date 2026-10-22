import type { UIMessage } from "ai"
import { supabase } from "./supabase"

export async function obtenerUltimaConversacion(visitorId: string): Promise<string | null> {

    const { data, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("visitor_id", visitorId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        throw new Error("No se pudo leer la última conversación: " + error.message)
    }

    return data?.id ?? null
}

export async function asegurarConversacion(id: string, visitorId: string): Promise<void> {

    const { data, error } = await supabase
        .from("conversations")
        .select("visitor_id")
        .eq("id", id)
        .maybeSingle()

    if (error) {
        throw new Error("No se pudo leer la conversación: " + error.message)
    }

    if (data === null) {

        const { error: errorAlCrear } = await supabase
            .from("conversations")
            .insert({ id, visitor_id: visitorId })

        if (errorAlCrear) {
            throw new Error("No se pudo crear la conversación: " + errorAlCrear.message)
        }
        return
    }

    if (data.visitor_id !== visitorId) {
        throw new Error("La conversación pertenece a otro visitante");
    }
}

export async function cargarMensajes(conversationId: string): Promise<UIMessage[]> {
    const { data, error } = await supabase
        .from("messages")
        .select("id, role, parts, metadata")
        .eq("conversation_id", conversationId)
        .order("posicion", { ascending: true });

    if (error) {
        throw new Error("No se pudieron cargar los mensajes: " + error.message);
    }

    return data.map((fila) => ({
        id: fila.id,
        role: fila.role,
        parts: fila.parts,
        metadata: fila.metadata ?? undefined,
    }));
}

export async function guardarMensajes(conversationId: string, mensajes: UIMessage[]): Promise<void> {
    const filas = mensajes.map((mensaje, indice) => ({
        id: mensaje.id,
        conversation_id: conversationId,
        role: mensaje.role,
        parts: mensaje.parts,
        metadata: mensaje.metadata ?? null,
        posicion: indice,
    }));

    const { error } = await supabase.from("messages").upsert(filas);

    if (error) {
        throw new Error("No se pudieron guardar los mensajes: " + error.message);
    }
}