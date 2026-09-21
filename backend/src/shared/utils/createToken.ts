import jwt from "jsonwebtoken";
import type { Role } from "../types/shared.types.js";
import { JWT_SECRET } from "../config/env.js";
import mongoose from "mongoose";

const createToken = async (userRole: Role): Promise<string> => {
  const token = jwt.sign(
    {
      id: new mongoose.Types.ObjectId().toString(),
      role: userRole,
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
    },
  );
  return token;
};

export default createToken;
