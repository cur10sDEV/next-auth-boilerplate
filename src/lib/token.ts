import VerificationToken from "@/data/verificationToken";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken = await VerificationToken.getVerificationTokenByEmail(
      email
    );

    if (existingToken) {
      await VerificationToken.deleteVerificationTokenById(existingToken.id);
    }

    const verificationToken = await VerificationToken.createToken(
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
