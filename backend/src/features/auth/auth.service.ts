import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/utils/errorClasses.js";
import User from "../users/users.model.js";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../../shared/config/env.js";
import type { Credential } from "./auth.types.js";
import { TokenPayload } from "../../shared/types/shared.types.js";

const login = async (credential: Credential) => {
  const { username, password } = credential;
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) throw new UnauthorizedError("Invalid username or password");
  const passwordIsCorrect = await bcrypt.compare(
    password,
    foundUser.passwordHash,
  );
  if (!passwordIsCorrect)
    throw new UnauthorizedError("Invalid username or password");
  const userObjectForToken: TokenPayload = {
    id: foundUser._id.toString(),
    role: foundUser.role,
  };
  const token = jwt.sign(userObjectForToken, JWT_SECRET, {
    algorithms: ["HS256"],
  });
  return {
    token,
    user: foundUser,
  };
};

const authService = {
  login,
};

export default authService;
