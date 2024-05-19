import UserService from "@/data/user";
import { verifyPassword } from "@/lib/password";
import { validator } from "@/lib/zod/validation";
import { loginSchema } from "@/schemas/authSchema";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = validator(loginSchema, credentials);

        if (validatedFields) {
          const { email, password } = validatedFields.data;

          const existingUser = await UserService.getUserByEmail(email);

          if (!existingUser || !existingUser.password) {
            return null;
          }

          const passwordMatch = await verifyPassword(
            password,
            existingUser.password
          );

          if (passwordMatch) {
            return existingUser;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
