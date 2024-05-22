import { db } from "../../prisma/db";

class TwoFactorConfirmationService {
  static async getTwoFactorConfirmationByUserId(userId: string) {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
        where: { userId },
      });

      return twoFactorConfirmation;
    } catch (error) {
      console.error("Database error - Two Factor Confirmation Service");
      return null;
    }
  }

  static async deleteTwoFactorConfirmationById(id: string) {
    try {
      await db.twoFactorConfirmation.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Database error - Two Factor Confirmation Service");
      return null;
    }
  }

  static async createToken(userId: string) {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.create({
        data: {
          userId: userId,
        },
      });

      return twoFactorConfirmation;
    } catch (error) {
      console.error("Database error - Two Factor Confirmation Service");
      return null;
    }
  }
}

export default TwoFactorConfirmationService;
