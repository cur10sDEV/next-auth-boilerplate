import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(128),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .max(128),
});
