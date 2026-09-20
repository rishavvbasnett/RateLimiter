import "./shared/config/env.js";
import express from "express";
import cors from "cors";
import userRouter from "./features/users/users.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import authRouter from "./features/auth/auth.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorHandler);

export default app;
