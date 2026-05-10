import { Router } from "express";
import { z } from "zod";

import { usersController } from "../controllers/users.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/me", usersController.me);
usersRouter.patch(
  "/me",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).max(80).optional(),
        avatarUrl: z.string().url().optional(),
        preferences: z.unknown().optional()
      })
    })
  ),
  usersController.updateMe
);
usersRouter.patch(
  "/me/password",
  validate(
    z.object({
      body: z.object({
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8).max(128)
      })
    })
  ),
  usersController.changePassword
);
usersRouter.delete("/me", usersController.deleteMe);
usersRouter.get("/", requireRole("ADMIN"), usersController.adminList);
