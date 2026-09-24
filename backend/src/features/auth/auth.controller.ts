import asyncHandler from "../../shared/middlewares/asyncHandler.js";
import authService from "./auth.service.js";
import { CredentialSchema } from "./auth.validation.js";
import { RefreshTokenSchema } from "./auth.validation.js";
import type { Request, Response, NextFunction } from "express";
import refreshService from "./auth.refresh.service.js";

const login = asyncHandler(async (req, res, next) => {
  const validCredential = CredentialSchema.parse(req.body);
  const tokens = await authService.login(validCredential);
  res.json(tokens);
});

export const refresh = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = RefreshTokenSchema.parse(req.body);
    const tokens = await refreshService.consumeToken(refreshToken);
    res.json(tokens);
  },
);

const authController = {
  login,
  refresh,
};

export default authController;
