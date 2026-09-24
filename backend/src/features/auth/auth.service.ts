import { UnauthorizedError } from "../../shared/utils/errorClasses.js";
import User from "../users/users.model.js";
import bcrypt from "bcrypt";
import type { Credential } from "./auth.types.js";
import type { AccessTokenPayload } from "../../shared/types/shared.types.js";
import { generateAccessToken, generateRefreshToken } from "./generateTokens.js";

const login = async (credential: Credential) => {
  const { username, password } = credential;
  const foundUser = await User.findOne({ username });

  if (!foundUser) throw new UnauthorizedError("Invalid username or password");
  const passwordIsCorrect = await bcrypt.compare(
    password,
    foundUser.passwordHash,
  );

  if (!passwordIsCorrect)
    throw new UnauthorizedError("Invalid username or password");

  const userObjectForToken: AccessTokenPayload = {
    id: foundUser._id.toString(),
    role: foundUser.role,
  };
  const accessToken = generateAccessToken(userObjectForToken);
  const refreshToken = await generateRefreshToken(foundUser._id.toString());

  return {
    accessToken,
    refreshToken,
    user: {
      id: foundUser._id.toString(),
      username: foundUser.username,
      role: foundUser.role,
    },
  };
};

const authService = {
  login,
};

export default authService;
