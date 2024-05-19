import { typeRegisterSchema } from "@/types/authTypes";
import { db } from "../../prisma/db";

class UserService {
  static async getUserByEmail(email: string) {
    try {
      const existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });

      return existingUser;
    } catch (error) {
      console.error("Database error");
      return null;
    }
  }

  static async createUser(data: typeRegisterSchema) {
    try {
      const { email, name, password } = data;
      const newUser = await db.user.create({
        data: {
          email,
          name,
          password,
        },
      });

      return newUser;
    } catch (error) {
      console.error("Database error");
      return null;
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      console.error("Database error");
      return null;
    }
  }

  static async makeUserEmailVerified(id: string) {
    try {
      await db.user.update({
        where: {
          id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    } catch (error) {
      console.error("Database error");
      return null;
    }
  }
}

export default UserService;
