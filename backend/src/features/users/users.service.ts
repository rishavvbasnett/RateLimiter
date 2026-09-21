import "dotenv/config";
import bcrypt from "bcrypt";

import User from "./users.model.js";
import { ItemNotFoundError } from "../../shared/utils/errorClasses.js";
import type { IdParam } from "../../shared/types/shared.types.js";
import type { UserDocument, UserDto, UserInput } from "./users.types.js";

const saltRounds = Number(process.env.SALT_ROUNDS);

const createOne = async (validUserInput: UserInput): Promise<UserDocument> => {
  const passwordHash = await bcrypt.hash(validUserInput.password, saltRounds);
  const userDocument = await User.create({
    username: validUserInput.username,
    passwordHash,
    role: validUserInput.role,
  });

  return userDocument;
};

const getOne = async (id: IdParam): Promise<UserDocument> => {
  const userDocument = await User.findById(id);

  if (!userDocument) {
    throw new ItemNotFoundError("User not found");
  }

  return userDocument;
};

const getAll = async (): Promise<UserDocument[]> => {
  const userDocuments = await User.find();
  return userDocuments;
};

const updateOne = async (
  id: IdParam,
  updates: Partial<UserInput>,
): Promise<UserDocument> => {
  const update: {
    username?: string;
    passwordHash?: string;
    role?: UserInput["role"];
  } = {};

  if (updates.username !== undefined) {
    update.username = updates.username;
  }

  if (updates.password !== undefined) {
    update.passwordHash = await bcrypt.hash(updates.password, saltRounds);
  }

  if (updates.role !== undefined) {
    update.role = updates.role;
  }

  const userDocument = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!userDocument) {
    throw new ItemNotFoundError("User not found");
  }

  return userDocument;
};

const deleteOne = async (id: IdParam): Promise<UserDocument> => {
  const userDocument = await User.findByIdAndDelete(id);

  if (!userDocument) {
    throw new ItemNotFoundError("User not found");
  }

  return userDocument;
};

const mapToDto = (userDocument: UserDocument): UserDto => {
  return {
    id: userDocument._id.toString(),
    username: userDocument.username,
    role: userDocument.role,
  };
};

const userService = {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  mapToDto,
};

export default userService;
