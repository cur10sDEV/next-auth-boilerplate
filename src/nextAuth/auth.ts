import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import AccountService from "@/data/account";
import TwoFactorConfirmationService from "@/data/twoFactorConfirmation";
import UserService from "@/data/user";
import { db } from "../../prisma/db";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await UserService.makeUserEmailVerifiedById(user.id as string);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await UserService.getUserById(user.id as string);

      if (!existingUser?.emailVerified) return false;

      if (existingUser?.isTwoFactorEnabled) {
        const existingConfirmation =
          await TwoFactorConfirmationService.getTwoFactorConfirmationByUserId(
            existingUser.id
          );

        if (!existingConfirmation) {
          return false;
        }

        await TwoFactorConfirmationService.deleteTwoFactorConfirmationById(
          existingConfirmation.id
        );
      }

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role;
        }

        if (token.name) {
          session.user.name = token.name;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await UserService.getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      const existingAccount = await AccountService.getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
