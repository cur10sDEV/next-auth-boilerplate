import { loginSchema } from "@/schemas/authSchema";
import { z } from "zod";

export type typeLoginSchema = z.infer<typeof loginSchema>;
