import express from "express";
import authController from "./auth.controller.js";
import rateLimit from "../../shared/middlewares/rateLimit.js";

const authRouter = express.Router();

authRouter.post(
  "/login",
  rateLimit({
    maxRequests: 5,
    resetWindowSeconds: 60,
    feature: "login",
    identityFn: (req) => req.ip ?? "unknown",
  }),
  authController.login,
);

export default authRouter;
