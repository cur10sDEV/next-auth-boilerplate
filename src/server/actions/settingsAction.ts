"use server";

import UserService from "@/data/user";
import { currentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { generateVerificationToken } from "@/lib/token";
import { validator } from "@/lib/zod/validation";
import { settingsSchema } from "@/schemas/settingsSchema";
import { actionResponse } from "@/types/generalTypes";
import { typeSettingsSchema } from "@/types/settingsTypes";

export const updateSettings = async (
  values: typeSettingsSchema
): Promise<actionResponse> => {
  try {
    const validatedData = validator(settingsSchema, values);

    const validFields = validatedData.data as typeSettingsSchema;

    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized!",
      };
    }

    const dbUser = await UserService.getUserById(user.id as string);

    if (!dbUser) {
      throw new Error("Unauthorized!");
    }

    if (user.isOAuth) {
      validFields.email = undefined;
      validFields.password = undefined;
      validFields.newPassword = undefined;
      validFields.isTwoFactorEnabled = undefined;
    }

    if (validFields.email && validFields.email !== user.email) {
      const existingUser = await UserService.getUserByEmail(validFields.email);

      if (existingUser && existingUser.id !== user.id) {
        throw new Error("Email already exists!");
      }

      const verificationToken = await generateVerificationToken(
        validFields.email
      );

      if (verificationToken) {
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );

        return { success: true, message: "Verification email sent!" };
      }
    }

    if (validFields.password && validFields.newPassword && dbUser.password) {
      const passwordMatch = await verifyPassword(
        validFields.password,
        dbUser.password
      );

      if (!passwordMatch) {
        throw new Error("Incorrect Password!");
      }

      const hashedPassword = await hashPassword(validFields.newPassword);

      validFields.password = hashedPassword;
      validFields.newPassword = undefined;
    }

    await UserService.updateUser(dbUser.id, validFields);

    return { success: true, message: "Settings updated!" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Failed to apply changes!",
    };
  }
};
