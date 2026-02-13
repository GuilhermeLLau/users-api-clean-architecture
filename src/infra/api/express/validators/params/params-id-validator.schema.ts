import { z } from "zod";

export const paramsIdValidatorSchema = z.object({
  id: z.uuid({ message: "Invalid id" }),
});
