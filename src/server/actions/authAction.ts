"use server";

import UserService from "@/data/user";
import { hashPassword } from "@/lib/password";
import { validator } from "@/lib/zod/validation";
import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { typeLoginSchema, typeRegisterSchema } from "@/types/authTypes";
import { actionResponse } from "@/types/generalTypes";

export const loginUser = async (
  values: typeLoginSchema
): Promise<actionResponse> => {
  const validatedData = validator(loginSchema, values);

  return { success: true, message: "Success!" };
};

// Create user
export const registerUser = async (
  values: typeRegisterSchema
): Promise<actionResponse> => {
  try {
    const validatedData = validator(registerSchema, values);

    const { email, name, password } = validatedData.data as typeRegisterSchema;

    const hashedPassword = await hashPassword(password);

    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      throw new Error("Email already in use!", { cause: "Email duplication" });
    }

    const createdUser = await UserService.createUser({
      ...validatedData.data,
      password: hashedPassword,
    });

    if (createdUser) {
    }

    // TODO: Send verification email

    return { success: true, message: "Registration Successfull!" };
  } catch (error: any) {
    console.error(error.message);
    return {
      success: false,
      message: error.message || "User registration failed!",
    };
  }
};
