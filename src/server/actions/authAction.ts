"use server";

import { validator } from "@/lib/zod/validation";
import { loginSchema } from "@/schemas/authSchema";
import { typeLoginSchema } from "@/types/authTypes";

export const loginUser = async (values: typeLoginSchema) => {
  const validatedData = validator(loginSchema, values);

  if (validatedData.error) {
    return validatedData;
  }

  return { ...validatedData, message: "Email Sent!" };
};
