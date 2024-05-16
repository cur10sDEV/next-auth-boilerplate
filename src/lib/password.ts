import { genSalt, hash } from "bcrypt";

export const hashPassword = async (inputPassword: string) => {
  try {
    const salt = await genSalt(12);
    const hashedPass = await hash(inputPassword, salt);
    return hashedPass;
  } catch (err: any) {
    throw new Error("Unable to hash Password!");
  }
};
