import { z } from "zod";

export const FeedbackSchema = z.object({
  valor: z.union([z.literal(1), z.literal(-1), z.null()]),
});

export type ValorFeedback = z.infer<typeof FeedbackSchema>["valor"];