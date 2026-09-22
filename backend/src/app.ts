import "./shared/config/env.js";
import express from "express";
import cors from "cors";
import userRouter from "./features/users/users.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import authRouter from "./features/auth/auth.routes.js";
import rateLimit from "./shared/middlewares/rateLimit.js";

const app = express();

app.use(express.json());
app.use(cors());
app.set("trust proxy", 1);
app.use(
  rateLimit({
    maxRequests: 300,
    resetWindowSeconds: 60,
    feature: "api",
    identityFn: (req) => req.ip ?? "unknown",
  }),
);

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorHandler);

export default app;
