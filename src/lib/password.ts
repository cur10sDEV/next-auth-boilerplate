import { compare, genSalt, hash } from "bcryptjs";

export const hashPassword = async (inputPassword: string) => {
  try {
    const salt = await genSalt(12);
    const hashedPass = await hash(inputPassword, salt);
    return hashedPass;
  } catch (err: any) {
    throw new Error("Unable to hash Password!");
  }
};

export const verifyPassword = async (inputPassword: string, hash: string) => {
  try {
    return await compare(inputPassword, hash);
  } catch (err: any) {
    throw new Error("Unable to verify Password!");
  }
};
