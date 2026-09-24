import { z } from "zod";

export const CredentialSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const RefreshTokenSchema = z.uuid();
