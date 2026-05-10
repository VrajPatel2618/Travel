import { Router } from "express";
import { z } from "zod";

import { tripsController } from "../controllers/trips.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const statusEnum = z.enum(["DRAFT", "PLANNING", "BOOKED", "ACTIVE", "COMPLETED", "ARCHIVED"]);
const visibilityEnum = z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]);
const activityCategory = z.enum([
  "ADVENTURE",
  "FOOD",
  "BEACHES",
  "HIKING",
  "MUSEUMS",
  "NIGHTLIFE",
  "CULTURE",
  "WELLNESS",
  "SHOPPING",
  "TRANSIT"
]);

export const tripsRouter = Router();
tripsRouter.use(authenticate);

tripsRouter.get("/", tripsController.list);
tripsRouter.post(
  "/",
  validate(
    z.object({
      body: z.object({
        title: z.string().min(2).max(120),
        description: z.string().max(2000).optional(),
        coverImageUrl: z.string().url().optional(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        budgetAmount: z.number().positive().optional(),
        currency: z.string().length(3).optional(),
        destinationIds: z.array(z.string()).optional()
      })
    })
  ),
  tripsController.create
);
tripsRouter.get("/:id", tripsController.get);
tripsRouter.patch(
  "/:id",
  validate(
    z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        title: z.string().min(2).max(120).optional(),
        description: z.string().max(2000).optional(),
        coverImageUrl: z.string().url().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        budgetAmount: z.number().positive().optional(),
        status: statusEnum.optional(),
        visibility: visibilityEnum.optional()
      })
    })
  ),
  tripsController.update
);
tripsRouter.delete("/:id", tripsController.remove);

tripsRouter.post(
  "/:id/destinations",
  validate(
    z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        cityId: z.string(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        stayNights: z.number().int().positive(),
        transportMode: z.string().optional()
      })
    })
  ),
  tripsController.addDestination
);
tripsRouter.patch(
  "/:id/destinations/reorder",
  validate(
    z.object({
      params: z.object({ id: z.string() }),
      body: z.object({ destinationIds: z.array(z.string()).min(1) })
    })
  ),
  tripsController.reorderDestinations
);
tripsRouter.post(
  "/:id/activities",
  validate(
    z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        tripDestinationId: z.string(),
        activityId: z.string().optional(),
        title: z.string().min(2),
        category: activityCategory,
        scheduledDate: z.string().datetime(),
        startTime: z.string().optional(),
        durationMinutes: z.number().int().positive(),
        estimatedCost: z.number().min(0).optional(),
        notes: z.string().optional()
      })
    })
  ),
  tripsController.addActivity
);
