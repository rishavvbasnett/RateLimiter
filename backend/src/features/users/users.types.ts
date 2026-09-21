import { z } from "zod";
import type { Document } from "mongoose";
import type { Role } from "../../shared/types/shared.types.js";
import { UserInputSchema } from "./users.validation.js";

export type UserInput = z.infer<typeof UserInputSchema>;

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  role: Role;
}

export interface UserDto {
  id: string;
  username: string;
  role: Role;
}
