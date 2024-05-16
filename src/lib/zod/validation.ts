import { z } from "zod";

interface IValidator {
  data: any;
}

export const validator = (
  schema: z.Schema,
  values: z.infer<z.Schema>
): IValidator => {
  const validatedFields = schema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields", { cause: "Schema validation Error" });
  }

  return { data: validatedFields.data };
};
