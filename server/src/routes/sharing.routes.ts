import { Router } from "express";
import { z } from "zod";

import { sharingController } from "../controllers/sharing.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const sharingRouter = Router();

sharingRouter.get("/public/:slug", sharingController.publicBySlug);
sharingRouter.post(
  "/trips/:tripId",
  authenticate,
  validate(
    z.object({
      params: z.object({ tripId: z.string() }),
      body: z.object({
        slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
        isPublic: z.boolean().optional(),
        expiresAt: z.string().datetime().optional()
      })
    })
  ),
  sharingController.create
);
