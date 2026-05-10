import type { NextFunction, Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { verifyAccessToken } from "../lib/security";
import { ApiError } from "../utils/api-error";

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      throw new ApiError(401, "Authentication token is required");
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true }
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
}
