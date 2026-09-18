import type { ErrorRequestHandler } from "express";

import { HttpError } from "../utils/errorClasses.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Unknown internal error",
  });
};