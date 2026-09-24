import redis from "../../shared/config/redis.js";
import { IdParam } from "../../shared/types/shared.types.js";
import { UnauthorizedError } from "../../shared/utils/errorClasses.js";
import User from "../users/users.model.js";
import { RefreshToken } from "./auth.types.js";
import { generateAccessToken, generateRefreshToken } from "./generateTokens.js";

const consumeToken = async (refreshToken: RefreshToken) => {
  const key = `refreshToken:${refreshToken}`;
  const userId = await redis.getdel(key);
  if (!userId) throw new UnauthorizedError("Invalid refresh token");

  const foundUser = await User.findById(userId);
  if (!foundUser) throw new UnauthorizedError("User doesn't exist in the DB");

  const accessToken = generateAccessToken({
    id: userId,
    role: foundUser.role,
  });
  const newRefreshToken = await generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: userId,
      username: foundUser.username,
      role: foundUser.role,
    },
  };
};

const refreshService = {
  consumeToken,
};

export default refreshService;
