import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errorClasses.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { TokenPayloadSchema } from "../validation/shared.validation.js";

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token)
    throw new UnauthorizedError("Missing token");

  const decodedTokenPayload = jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });

  const parseTokenPayload = TokenPayloadSchema.safeParse(decodedTokenPayload);

  if (!parseTokenPayload.success) throw new UnauthorizedError("Invalid token");

  req.user = parseTokenPayload.data;
  next();
};

export default authenticate;
