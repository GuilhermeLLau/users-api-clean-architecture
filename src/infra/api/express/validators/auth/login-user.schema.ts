import * as z from "zod";

export const loginUserBodySchema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Invalid password"),
});
