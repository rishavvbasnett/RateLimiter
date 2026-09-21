import type { Role } from "../types/shared.types.js";

export const createUserPayload = (
  overrides: Partial<{ username: string; password: string; role: Role }> = {},
): { username: string; password: string; role: Role } => {
  return {
    username: "user",
    password: "1",
    role: "guest",
    ...overrides,
  };
};
