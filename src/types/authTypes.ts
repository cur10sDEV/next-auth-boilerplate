import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { z } from "zod";

export type typeLoginSchema = z.infer<typeof loginSchema>;

export type typeRegisterSchema = z.infer<typeof registerSchema>;
