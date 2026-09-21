import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import { z } from "zod";
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";

import { HttpError } from "../utils/errorClasses.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: err.issues.map((issue) => issue.message).join(", "),
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: `Invalid ${err.path}`,
    });
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    return res.status(409).json({
      error: "A resource with the provided value already exists",
    });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      error: "Token expired",
    });
  }

  if (err instanceof NotBeforeError) {
    return res.status(401).json({
      error: "Token not yet valid",
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  return res.status(500).json({
    error: "Unknown internal error",
  });
};
