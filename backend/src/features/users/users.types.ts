import { z } from "zod";
import type { Document } from "mongoose";
import { UserInputSchema } from "./users.validation.js";

export type UserInput = z.infer<typeof UserInputSchema>;

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
}

export interface UserDto {
  username: string;
}
