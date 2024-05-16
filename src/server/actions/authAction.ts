"use server";

import { validator } from "@/lib/zod/validation";
import { loginSchema } from "@/schemas/authSchema";
import { typeLoginSchema, typeRegisterSchema } from "@/types/authTypes";

export const loginUser = async (values: typeLoginSchema) => {
  const validatedData = validator(loginSchema, values);

  if (validatedData.error) {
    return validatedData;
  }

  return { ...validatedData, message: "Email Sent!" };
};

export const registerUser = async (values: typeRegisterSchema) => {
  const validatedData = validator(loginSchema, values);

  if (validatedData.error) {
    return validatedData;
  }

  return { ...validatedData, message: "Email Sent!" };
};
