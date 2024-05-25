import { settingsSchema } from "@/schemas/settingsSchema";
import { z } from "zod";

export type typeSettingsSchema = z.infer<typeof settingsSchema>;
