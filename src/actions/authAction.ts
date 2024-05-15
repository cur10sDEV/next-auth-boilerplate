"use server";

import { typeLoginSchema } from "@/types/authTypes";

export const loginUser = (values: typeLoginSchema) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ message: "Data successfully saved!" });
    }, 3000);
  });
};
