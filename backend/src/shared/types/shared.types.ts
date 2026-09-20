import z from "zod";
import { IdParamSchema } from "../validation/shared.validation.js";

export type IdParam = z.infer<typeof IdParamSchema>["id"];
export type Role = "guest" | "admin";
