import { Router } from "express";
import { z } from "zod";

import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";

const password = z.string().min(8).max(128);

export const authRouter = Router();

authRouter.post(
  "/signup",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).max(80),
        email: z.string().email(),
        password
      })
    })
  ),
  authController.register
);

authRouter.post(
  "/login",
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        password
      })
    })
  ),
  authController.login
);

authRouter.post(
  "/refresh",
  validate(z.object({ body: z.object({ refreshToken: z.string().optional() }).optional() })),
  authController.refresh
);

authRouter.post("/logout", authController.logout);

authRouter.post(
  "/forgot-password",
  validate(z.object({ body: z.object({ email: z.string().email() }) })),
  authController.forgotPassword
);

authRouter.post(
  "/reset-password",
  validate(z.object({ body: z.object({ token: z.string().min(20), password }) })),
  authController.resetPassword
);

authRouter.post(
  "/verify-email",
  validate(z.object({ body: z.object({ token: z.string().min(20) }) })),
  authController.verifyEmail
);
