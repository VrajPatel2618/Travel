import type { Request, Response } from "express";

import { env } from "../config/env";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok } from "../utils/response";

const refreshCookie = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  domain: env.COOKIE_DOMAIN,
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie("traveloop_refresh", token, refreshCookie);
}

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.session.refreshToken);
    return created(res, result, "Account created");
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.session.refreshToken);
    return ok(res, result, "Logged in");
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.refreshToken ?? req.cookies.traveloop_refresh;
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.session.refreshToken);
    return ok(res, result, "Session refreshed");
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.body.refreshToken ?? req.cookies.traveloop_refresh);
    res.clearCookie("traveloop_refresh", { path: "/api/auth" });
    return ok(res, null, "Logged out");
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    return ok(res, result, "If the account exists, a reset link has been sent");
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body);
    return ok(res, null, "Password reset complete");
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const user = await authService.verifyEmail(req.body.token);
    return ok(res, { user }, "Email verified");
  })
};
