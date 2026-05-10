import { Router } from "express";
import { z } from "zod";

import { journalsController } from "../controllers/journals.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const journalsRouter = Router();
journalsRouter.use(authenticate);

journalsRouter.get("/", journalsController.list);
journalsRouter.post(
  "/",
  validate(
    z.object({
      body: z.object({
        tripId: z.string().optional(),
        tripDestinationId: z.string().optional(),
        type: z.enum(["JOURNAL", "REMINDER", "MEMORY"]).optional(),
        title: z.string().min(2),
        content: z.string().min(1),
        images: z.unknown().optional(),
        dayIndex: z.number().int().optional(),
        reminderAt: z.string().datetime().optional()
      })
    })
  ),
  journalsController.create
);
journalsRouter.patch("/:noteId", journalsController.update);
journalsRouter.delete("/:noteId", journalsController.remove);
