import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from "@/schemas/authSchema";
import { z } from "zod";

export type typeLoginSchema = z.infer<typeof loginSchema>;

export type typeRegisterSchema = z.infer<typeof registerSchema>;

export type typeResetSchema = z.infer<typeof resetSchema>;

export type typeNewPassword = z.infer<typeof newPasswordSchema>;
