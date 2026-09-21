import userController from "./users.controller.js";
import express from "express";
import authenticate from "../../shared/middlewares/authenticate.js";
import requireRoles from "../../shared/middlewares/requireRoles.js";

const userRouter = express.Router();

userRouter.post(
  "/",
  authenticate,
  requireRoles("admin"),
  userController.createOne,
);
userRouter.get("/", authenticate, requireRoles("admin"), userController.getAll);

userRouter.get(
  "/:id",
  authenticate,
  requireRoles("admin"),
  userController.getOne,
);
userRouter.patch(
  "/:id",
  authenticate,
  requireRoles("admin"),
  userController.updateOne,
);
userRouter.delete(
  "/:id",
  authenticate,
  requireRoles("admin"),
  userController.deleteOne,
);

export default userRouter;
