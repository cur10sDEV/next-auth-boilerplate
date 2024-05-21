"use server";

import UserService from "@/data/user";
import VerificationTokenService from "@/data/verificationToken";
import { hashPassword } from "@/lib/password";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/resend/mail";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/token";
import { validator } from "@/lib/zod/validation";
import { signIn } from "@/nextAuth/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema, registerSchema, resetSchema } from "@/schemas/authSchema";
import {
  typeLoginSchema,
  typeRegisterSchema,
  typeResetSchema,
} from "@/types/authTypes";
import { actionResponse } from "@/types/generalTypes";
import { AuthError } from "next-auth";

export const loginUser = async (
  values: typeLoginSchema
): Promise<actionResponse> => {
  try {
    const validatedData = validator(loginSchema, values);

    if (validatedData) {
      const { email, password } = validatedData.data;

      const existingUser = await UserService.getUserByEmail(email);

      if (!existingUser || !existingUser.email || !existingUser.password) {
        return { success: false, message: "Invalid Credentials!" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        );

        if (verificationToken) {
          await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
          );

          return { success: true, message: "Confirmation email sent!" };
        }
      }

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
        default:
          return { success: false, message: "Something went wrong!" };
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

    const verificationToken = await generateVerificationToken(email);

    if (verificationToken) {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: true, message: "Confirmation email sent!" };
    }

    return { success: false, message: "User registration failed!" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "User registration failed!",
    };
  }
};

export const verifyUserEmail = async (
  token: string
): Promise<actionResponse> => {
  try {
    const existingToken =
      await VerificationTokenService.getVerificationTokenByToken(token);

    if (!existingToken) {
      throw new Error("Invalid Verification Link!");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new Error("Verification link has expired!");
    }

    const existingUser = await UserService.getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error("Email does not exist!");
    }

    await UserService.makeUserEmailVerifiedByEmail(existingToken.email);

    await VerificationTokenService.deleteVerificationTokenById(
      existingToken.id
    );

    return { success: true, message: "Email verified!" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Email Verification Failed!",
    };
  }
};

export const sendResetEmail = async (
  values: typeResetSchema
): Promise<actionResponse> => {
  try {
    const validatedFields = validator(resetSchema, values);

    const { email } = validatedFields.data as typeResetSchema;

    const existingUser = await UserService.getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
      throw new Error("Email not found!");
    }

    const passwordResetToken = await generatePasswordResetToken(
      existingUser.email
    );

    if (passwordResetToken) {
      await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
      );

      return { success: true, message: "Reset email sent!" };
    }

    return { success: false, message: "Email cannot be sent!" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};
