import { z } from "zod";

export const LARGO_MAXIMO_MENSAJE = 1000;

const MensajeDelUsuarioSchema = z.object({
  id: z.string().min(1),
  role: z.literal("user"),
  parts: z
    .array(
      z.object({
        type: z.literal("text"),
        text: z.string().trim().min(1).max(LARGO_MAXIMO_MENSAJE),
      }),
    )
    .min(1),
});

export const PedidoDeChatSchema = z.object({
  id: z.uuid(),
  message: MensajeDelUsuarioSchema,
});