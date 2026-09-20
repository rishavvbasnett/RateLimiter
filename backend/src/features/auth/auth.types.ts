import { z } from "zod";
import { CredentialSchema } from "./auth.validation.js";
import { Role } from "../../shared/types/shared.types.js";

export type Credential = z.infer<typeof CredentialSchema>;
export interface UserTokenObject {
  id: string;
  role: Role;
}
