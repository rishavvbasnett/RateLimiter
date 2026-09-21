import { model, Schema } from "mongoose";

import type { Role } from "../../shared/types/shared.types.js";
import type { UserDocument } from "./users.types.js";

export const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["guest", "admin"] satisfies Role[],
    required: true,
  },
});

const User = model<UserDocument>("User", UserSchema);

export default User;
