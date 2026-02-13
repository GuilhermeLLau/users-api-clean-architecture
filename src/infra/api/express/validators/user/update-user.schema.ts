import { z } from "zod";

export const updateUserBodySchema: z.ZodObject = z.object({
  name: z.string().min(2, "name must have at least 2 characters"),
});
