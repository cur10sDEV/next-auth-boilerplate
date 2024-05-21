import { db } from "../../prisma/db";

class PasswordResetTokenService {
  static async getPasswordResetTokenByEmail(email: string) {
    try {
      const passwordResetToken = await db.passwordResetToken.findFirst({
        where: { email },
      });

      return passwordResetToken;
    } catch (error) {
      console.error("Database error - Password Reset Token Service");
      return null;
    }
  }

  static async getPasswordResetTokenByToken(token: string) {
    try {
      const passwordResetToken = await db.passwordResetToken.findUnique({
        where: { token },
      });

      return passwordResetToken;
    } catch (error) {
      console.error("Database error - Password Reset Token Service");
      return null;
    }
  }

  static async deletePasswordResetTokenById(id: string) {
    try {
      await db.passwordResetToken.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Database error - Password Reset Token Service");
      return null;
    }
  }

  static async createToken(email: string, token: string, expires: Date) {
    try {
      const newToken = await db.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      });

      return newToken;
    } catch (error) {
      console.error("Database error - Password Reset Token Service");
      return null;
    }
  }
}

export default PasswordResetTokenService;
