import UserService from "@/data/user";
import { verifyPassword } from "@/lib/password";
import { validator } from "@/lib/zod/validation";
import { loginSchema } from "@/schemas/authSchema";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = validator(loginSchema, credentials);

        if (validatedFields) {
          const { email, password } = validatedFields.data;

          const existingUser = await UserService.getUserByEmail(email);

          if (existingUser && existingUser.password) {
            const passwordMatch = await verifyPassword(
              password,
              existingUser.password
            );

            if (passwordMatch) {
              return existingUser;
            }
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
