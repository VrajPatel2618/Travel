import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

import { ApiError } from "../utils/api-error";
import { env } from "../config/env";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      details: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = error.code === "P2025" ? 404 : error.code === "P2002" ? 409 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.code === "P2002" ? "Resource already exists" : "Database request failed",
      details: env.NODE_ENV === "production" ? undefined : error.meta
    });
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    details: error instanceof ApiError ? error.details : undefined,
    stack: env.NODE_ENV === "production" ? undefined : error.stack
  });
}
