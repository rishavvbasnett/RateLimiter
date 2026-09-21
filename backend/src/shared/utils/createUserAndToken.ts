import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../../features/users/users.model.js";
import userService from "../../features/users/users.service.js";
import type { Role } from "../types/shared.types.js";
import { JWT_SECRET } from "../config/env.js";

const createUserAndToken = async (userRole: Role): Promise<string> => {
  const user = await userService.createOne({
    username: `user-${randomUUID()}`,
    password: "1",
    role: userRole,
  });
  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
    },
  );
  return token;
};

export default createUserAndToken;
