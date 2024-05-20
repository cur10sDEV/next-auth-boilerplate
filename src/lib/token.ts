import VerificationTokenService from "@/data/verificationToken";
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
