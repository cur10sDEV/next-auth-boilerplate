import { db } from "../../prisma/db";

class TwoFactorTokenService {
  static async createToken(email: string, expires: Date, token: string) {
    try {
      const newToken = await db.twoFactorToken.create({
        data: {
          email,
          token,
          expires,
        },
      });

      return newToken;
    } catch (error) {
      console.error("Database error - Two Factor Token Service");
      return null;
    }
  }

  static async getTwoFactorTokenByEmail(email: string) {
    try {
      const twoFactorToken = await db.twoFactorToken.findFirst({
        where: { email },
      });

      return twoFactorToken;
    } catch (error) {
      console.error("Database error - Two Factor Token Service");
      return null;
    }
  }

  static async getTwoFactorTokenByToken(token: string) {
    try {
      const twoFactorToken = await db.twoFactorToken.findUnique({
        where: {
          token,
        },
      });

      return twoFactorToken;
    } catch (error) {
      console.error("Database error - Two Factor Token Service");
      return null;
    }
  }

  static async deleteTwoFactorTokenById(id: string) {
    try {
      await db.twoFactorToken.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Database error - Two Factor Token Service");
      return null;
    }
  }
}

export default TwoFactorTokenService;
