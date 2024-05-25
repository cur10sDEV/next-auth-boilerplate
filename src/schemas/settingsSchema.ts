import { UserRole } from "@prisma/client";
import { z } from "zod";

export const settingsSchema = z
  .object({
    name: z.optional(
      z
        .string()
        .trim()
        .min(1, { message: "Name is required" })
        .max(128, { message: "Maximum 128 characters allowed" })
    ),
    email: z.optional(
      z
        .string()
        .trim()
        .min(1, {
          message: "Email is required",
        })
        .email({
          message: "Please enter a valid email address",
        })
        .max(128, { message: "Maximum 128 characters allowed" })
    ),
    password: z.optional(
      z
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
        })
    ),
    newPassword: z.optional(
      z
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
        })
    ),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      if (
        data.password &&
        data.newPassword &&
        data.newPassword === data.password
      ) {
        return false;
      }

      return true;
    },
    {
      message: "New and Current Password are required and they cannot be same!",
      path: ["newPassoword"],
    }
  );
