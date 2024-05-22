import PasswordResetTokenService from "@/data/passwordResetToken";
import TwoFactorTokenService from "@/data/twoFactorToken";
import VerificationTokenService from "@/data/verificationToken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken =
      await VerificationTokenService.getVerificationTokenByEmail(email);

    if (existingToken) {
      await VerificationTokenService.deleteVerificationTokenById(
        existingToken.id
      );
    }

    const verificationToken = await VerificationTokenService.createToken(
      email,
      token,
      expires
    );

    if (verificationToken) {
      return verificationToken;
    }

    return null;
  } catch (error) {
    throw new Error("Failed to generate verification token!");
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken =
      await PasswordResetTokenService.getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await PasswordResetTokenService.deletePasswordResetTokenById(
        existingToken.id
      );
    }

    const passwordResetToken = await PasswordResetTokenService.createToken(
      email,
      token,
      expires
    );

    if (passwordResetToken) {
      return passwordResetToken;
    }

    return null;
  } catch (error) {
    throw new Error("Failed to generate password reset token!");
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken = await TwoFactorTokenService.getTwoFactorTokenByEmail(
      email
    );

    if (existingToken) {
      await TwoFactorTokenService.deleteTwoFactorTokenById(existingToken.id);
    }

    const twoFactorToken = await TwoFactorTokenService.createToken(
      email,
      expires,
      token
    );

    if (twoFactorToken) {
      return twoFactorToken;
    }

    return null;
  } catch (error) {
    throw new Error("Failed to generate two factor token");
  }
};
