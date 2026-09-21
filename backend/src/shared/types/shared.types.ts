import z from "zod";
import {
  IdParamSchema,
  TokenPayloadSchema,
} from "../validation/shared.validation.js";

export type Role = "guest" | "admin";
export type IdParam = z.infer<typeof IdParamSchema>["id"];
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
