import type { Request, Response } from "express";
import asyncHandler from "../../shared/middlewares/asyncHandler.js";
import { IdParamSchema } from "../../shared/validation/shared.validation.js";
import { UserInputSchema, UserUpdateSchema } from "./users.validation.js";
import userService from "./users.service.js";

export const createOne = asyncHandler(async (req: Request, res: Response) => {
  const validUserInput = UserInputSchema.parse(req.body);
  const createdUser = await userService.createOne(validUserInput);
  res.json(userService.mapToDto(createdUser));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);
  const user = await userService.getOne(id);
  res.json(userService.mapToDto(user));
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  res.json(users.map(userService.mapToDto));
});

export const updateOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);
  const updates = UserUpdateSchema.parse(req.body);
  const updatedUser = await userService.updateOne(id, updates);
  res.json(userService.mapToDto(updatedUser));
});

export const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);
  const deletedUser = await userService.deleteOne(id);
  res.json(userService.mapToDto(deletedUser));
});

const userController = {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
};

export default userController;
