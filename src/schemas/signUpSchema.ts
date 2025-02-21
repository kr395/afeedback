import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");
  
export const emailValidation = z
  .string()
  .email("Invalid email address")
  .min(3, "Email must be at least 3 characters")
  .max(50, "Email must be at most 50 characters");

export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must be at most 50 characters")

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
