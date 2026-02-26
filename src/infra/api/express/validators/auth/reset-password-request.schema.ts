import * as z from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.email("Invalid email"),
});
