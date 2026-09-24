import z from "zod";
import {
  IdParamSchema,
  AccessTokenPayloadSchema,
} from "../validation/shared.validation.js";
import type { Request } from "express";

export type Role = "guest" | "admin";
export type IdParam = z.infer<typeof IdParamSchema>["id"];
export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export interface RateLimitOptions {
  maxRequests: number;
  resetWindowSeconds: number;
  feature: string;
  identityFn: (req: Request) => string;
}
