import { z } from "zod";
import { CredentialSchema } from "./auth.validation.js";

export type Credential = z.infer<typeof CredentialSchema>;
