import { z } from "zod";
import { CredentialSchema } from "./auth.validation.js";
import { RefreshTokenSchema } from "./auth.validation.js";

export type Credential = z.infer<typeof CredentialSchema>;

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
