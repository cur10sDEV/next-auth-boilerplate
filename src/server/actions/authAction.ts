"use server";

import UserService from "@/data/user";
import { hashPassword } from "@/lib/password";
import { validator } from "@/lib/zod/validation";
import { signIn } from "@/nextAuth/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { typeLoginSchema, typeRegisterSchema } from "@/types/authTypes";
import { actionResponse } from "@/types/generalTypes";
import { AuthError } from "next-auth";

export const loginUser = async (
  values: typeLoginSchema
): Promise<actionResponse> => {
  try {
    const validatedData = validator(loginSchema, values);

    if (validatedData) {
      const { email, password } = validatedData.data;

      await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });

      return { success: true, message: "Success!" };
    }

    return { success: false, message: "Login failed!" };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid Credentials!" };
      }
    }

    throw error;
  }
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

    if (!createdUser) {
      throw new Error("Unable to register user");
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
