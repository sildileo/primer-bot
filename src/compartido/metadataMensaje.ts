import { z } from "zod";
import type { UIMessage } from "ai";

export const MetadataMensajeSchema = z.object({
  modelo: z.string().optional(),
  inicio: z.number().optional(),
  duracionMs: z.number().optional(),
  tokensEntrada: z.number().optional(),
  tokensSalida: z.number().optional(),
  tokensTotales: z.number().optional(),
});

export type MetadataMensaje = z.infer<typeof MetadataMensajeSchema>;
export type MensajePRimer = UIMessage<MetadataMensaje>;