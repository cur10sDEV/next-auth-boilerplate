import { db } from "../../prisma/db";

class VerificationTokenService {
  static async getVerificationTokenByEmail(email: string) {
    try {
      const verificationToken = await db.verificationToken.findFirst({
        where: { email },
      });

      return verificationToken;
    } catch (error) {
      console.error("Database error - Verification Token Service");
      return null;
    }
  }

  static async getVerificationTokenByToken(token: string) {
    try {
      const verificationToken = await db.verificationToken.findUnique({
        where: { token },
      });

      return verificationToken;
    } catch (error) {
      console.error("Database error - Verification Token Service");
      return null;
    }
  }

  static async deleteVerificationTokenById(id: string) {
    try {
      await db.verificationToken.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Database error - Verification Token Service");
      return null;
    }
  }

  static async createToken(email: string, token: string, expires: Date) {
    try {
      const newToken = await db.verificationToken.create({
        data: {
          email,
          token,
          expires,
        },
      });

      return newToken;
    } catch (error) {
      console.error("Database error - Verification Token Service");
      return null;
    }
  }
}

export default VerificationTokenService;
