import { z } from "zod";

export const createUserBodySchema: z.ZodObject = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
});
