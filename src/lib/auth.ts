import { auth } from "@/nextAuth/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};
