import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import redis from "../../shared/config/redis.js";
import { JWT_SECRET } from "../../shared/config/env.js";
import type {
  IdParam,
  AccessTokenPayload,
} from "../../shared/types/shared.types.js";

const ACCESS_TOKEN_TTL = "5m";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

export const generateRefreshToken = async (userId: IdParam) => {
  const token = crypto.randomUUID();
  const key = `refreshToken:${token}`;
  await redis.setex(key, REFRESH_TOKEN_TTL, userId);
  return token;
};

export const generateAccessToken = (tokenPayload: AccessTokenPayload) => {
  return jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    jwtid: crypto.randomUUID(),
    algorithm: "HS256",
  });
};
