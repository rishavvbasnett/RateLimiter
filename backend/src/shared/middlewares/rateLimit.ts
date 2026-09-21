import redis from "../config/redis.js";
import type { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "../utils/errorClasses.js";
import { RateLimitOptions } from "../types/shared.types.js";
import asyncHandler from "./asyncHandler.js";

const rateLimit = (options: RateLimitOptions) => {
  return asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const identity = options.identityFn(req);
      const key = `rateLimit:${options.feature}:${identity}`;
      const count = await redis.incr(key);

      if (count === 1) await redis.expire(key, options.resetWindowSeconds);
      if (count > options.maxRequests)
        throw new TooManyRequestsError("Rate limit exceeded");

      next();
    },
  );
};

export default rateLimit;
