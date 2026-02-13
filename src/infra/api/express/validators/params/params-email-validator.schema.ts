import { z } from "zod";

export const paramsEmailValidatorSchema = z.object({
  email: z.email({ message: "Invalid email" }),
});
