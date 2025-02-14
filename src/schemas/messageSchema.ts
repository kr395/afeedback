import { z } from "zod";

export const messagesSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(200, "Content must be at most 200 characters"),
});
