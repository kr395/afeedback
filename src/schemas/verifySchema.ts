import {z} from 'zod'


export const verifySchema = z.object({
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(6, "Code must be at most 6 characters"),
})