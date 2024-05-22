import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    })
    .max(128, { message: "Maximum 128 characters allowed" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .max(128),
  code: z.optional(
    z
      .string()
      .min(6, "The code should be 6 digits long")
      .max(6, "The code should be 6 digits long")
  ),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(128, { message: "Maximum 128 characters allowed" }),
    email: z
      .string()
      .trim()
      .min(1, {
        message: "Email is required",
      })
      .email({
        message: "Please enter a valid email address",
      })
      .max(128, { message: "Maximum 128 characters allowed" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Maximum 128 characters allowed" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[#?!@$%^&*-]/, {
        message: "Password must contain at least on special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

export const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    })
    .max(128, { message: "Maximum 128 characters allowed" }),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Maximum 128 characters allowed" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[#?!@$%^&*-]/, {
        message: "Password must contain at least on special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });
