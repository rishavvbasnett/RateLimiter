import { asyncHandler } from "../../shared/middlewares/asyncHandler.js";
import authService from "./auth.service.js";
import { CredentialSchema } from "./auth.validation.js";

const login = asyncHandler(async (req, res, next) => {
  const validCredential = CredentialSchema.parse(req.body);
  const token = await authService.login(validCredential);
  res.json(token);
});

const authController = {
  login,
};

export default authController;
