import z from "zod";
import {
  IdParamSchema,
  TokenPayloadSchema,
} from "../validation/shared.validation.js";
import type { Request } from "express";

export type Role = "guest" | "admin";
export type IdParam = z.infer<typeof IdParamSchema>["id"];
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export interface RateLimitOptions {
  maxRequests: number;
  resetWindowSeconds: number;
  feature: string;
  identityFn: (req: Request) => string;
}
