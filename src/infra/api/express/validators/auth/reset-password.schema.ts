import * as z from "zod";

export const resetPasswordSchema = z.object({
  token: z.string("Invalid token type"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});
