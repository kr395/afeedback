import { z } from "zod";

  
export const emailValidation = z
  .string()
  .email("Invalid email address")
  .min(3, "Email must be at least 3 characters")
  .max(50, "Email must be at most 50 characters");

export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must be at most 50 characters")

export const singInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});
