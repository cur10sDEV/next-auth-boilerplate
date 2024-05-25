"use server";

import PasswordResetTokenService from "@/data/passwordResetToken";
import TwoFactorConfirmationService from "@/data/twoFactorConfirmation";
import TwoFactorTokenService from "@/data/twoFactorToken";
import UserService from "@/data/user";
import VerificationTokenService from "@/data/verificationToken";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  sendPasswordResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from "@/lib/resend/mail";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/token";
import { validator } from "@/lib/zod/validation";
import { signIn, signOut } from "@/nextAuth/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from "@/schemas/authSchema";
import {
  typeLoginSchema,
  typeNewPassword,
  typeRegisterSchema,
  typeResetSchema,
} from "@/types/authTypes";
import { actionResponse } from "@/types/generalTypes";
import { AuthError } from "next-auth";

export const loginUser = async (
  values: typeLoginSchema,
  callbackUrl?: string
): Promise<actionResponse> => {
  try {
    const validatedData = validator(loginSchema, values);

    if (validatedData) {
      const { email, password, code } = validatedData.data;

      const existingUser = await UserService.getUserByEmail(email);

      if (!existingUser || !existingUser.email || !existingUser.password) {
        return { success: false, message: "Invalid Credentials!" };
      }

      const matchPassword = await verifyPassword(
        password,
        existingUser.password
      );

      if (!matchPassword) {
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

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken =
            await TwoFactorTokenService.getTwoFactorTokenByEmail(
              existingUser.email
            );

          if (!twoFactorToken) {
            return { success: false, message: "Invalid Code!" };
          }

          if (twoFactorToken.token !== code) {
            return { success: false, message: "Invalid Code!" };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return { success: false, message: "Code expired!" };
          }

          await TwoFactorTokenService.deleteTwoFactorTokenById(
            twoFactorToken.id
          );

          const twoFactorConfirmation =
            await TwoFactorConfirmationService.getTwoFactorConfirmationByUserId(
              existingUser.id
            );

          if (twoFactorConfirmation) {
            await TwoFactorConfirmationService.deleteTwoFactorConfirmationById(
              twoFactorConfirmation.id
            );
          }

          await TwoFactorConfirmationService.createToken(existingUser.id);
        } else {
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email
          );

          if (twoFactorToken) {
            await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);

            return {
              success: true,
              twoFactor: true,
              message: "Two Factor code sent!",
            };
          }
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
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
      message: error.message || "Something went wrong!",
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
      message: error.message || "Something went wrong!",
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

export const newPassword = async (
  values: typeNewPassword,
  token?: string
): Promise<actionResponse> => {
  try {
    const validatedFields = validator(newPasswordSchema, values);

    const { password } = validatedFields.data as typeNewPassword;

    if (!token) {
      throw new Error("Invalid reset link!");
    }

    const existingToken =
      await PasswordResetTokenService.getPasswordResetTokenByToken(token);

    if (!existingToken) {
      throw new Error("Invalid reset link!");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new Error("Reset link has expired!");
    }

    const existingUser = await UserService.getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error("Email does not exist!");
    }

    const hashedPassword = await hashPassword(password);

    await UserService.changeUserPasswordById(existingUser.id, hashedPassword);

    await PasswordResetTokenService.deletePasswordResetTokenById(
      existingToken.id
    );

    return { success: true, message: "Password updated!" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};

export const logoutUser = async () => {
  await signOut({ redirectTo: "/auth/login" });
};
