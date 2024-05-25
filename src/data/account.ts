import { db } from "../../prisma/db";

class AccountService {
  static async getAccountByUserId(userId: string) {
    try {
      const account = await db.account.findFirst({
        where: {
          userId,
        },
      });

      return account;
    } catch (error) {
      console.error("Database Error - Account Service");
      return null;
    }
  }
}

export default AccountService;
