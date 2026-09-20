import express from "express";
import authController from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);

export default authRouter;
