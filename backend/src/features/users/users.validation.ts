import { z } from "zod";

export const UserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(["guest", "admin"]),
});

export const UserUpdateSchema = UserInputSchema.partial();
