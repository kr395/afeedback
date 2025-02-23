import { z } from "zod";

  
export const identifierValidation = z
  .string()
  .min(3, "Email/Username must be at least 3 characters")
  .max(50, "Email/Username must be at most 50 characters");

export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must be at most 50 characters")

export const singInSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});
