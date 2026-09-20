import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const JWT_SECRET = jwtSecret;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
