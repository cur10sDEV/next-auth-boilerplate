import { z } from "zod";

interface IValidator {
  message: string;
  error: boolean;
  success: boolean;
  data: any;
}

export const validator = (
  schema: z.Schema,
  values: z.infer<z.Schema>
): IValidator => {
  const validatedFields = schema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: true,
      success: false,
      message: "Invalid fields!",
      data: null,
    };
  }

  return {
    error: false,
    success: true,
    message: "All fields are valid",
    data: validatedFields.data,
  };
};
