import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errorClasses.js";
import type { Role } from "../types/shared.types.js";

const requireRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) throw new UnauthorizedError("Unauthorized access");
    if (!allowedRoles.includes(role)) throw new ForbiddenError("Forbidden");
    next();
  };
};

export default requireRoles;
