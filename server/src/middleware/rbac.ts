import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";

import { ApiError } from "../utils/api-error";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
}
