export const createUserPayload = (
  overrides: Partial<{ username: string; password: string; role: "guest" | "admin" }> = {},
) => {
  return {
    username: "user",
    password: "1",
    role: "guest" as const,
    ...overrides,
  };
};
