import { model, Schema } from "mongoose";

import type { UserDocument } from "./users.types.js";

export const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = model<UserDocument>("User", UserSchema);

export default User;
