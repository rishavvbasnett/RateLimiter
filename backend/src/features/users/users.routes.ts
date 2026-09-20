import userController from "./users.controller.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/", userController.createOne);
userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);
userRouter.patch("/:id", userController.updateOne);
userRouter.delete("/:id", userController.deleteOne);

export default userRouter;
