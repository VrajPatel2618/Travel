import { Router } from "express";
import { z } from "zod";

import { discoveryController } from "../controllers/discovery.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";

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

export const citiesRouter = Router();
export const activitiesRouter = Router();

citiesRouter.get("/", discoveryController.cities);
citiesRouter.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2),
        country: z.string().min(2),
        region: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        imageUrl: z.string().url().optional(),
        popularityScore: z.number().int().min(0).max(100).optional(),
        costIndex: z.number().int().min(0).max(100).optional(),
        weatherSummary: z.string().optional(),
        bestMonths: z.array(z.string()).optional(),
        description: z.string().optional()
      })
    })
  ),
  discoveryController.createCity
);
citiesRouter.post("/:cityId/save", authenticate, discoveryController.saveCity);
citiesRouter.delete("/:cityId/save", authenticate, discoveryController.unsaveCity);

activitiesRouter.get("/", discoveryController.activities);
activitiesRouter.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(
    z.object({
      body: z.object({
        cityId: z.string().optional(),
        title: z.string().min(2),
        category: activityCategory,
        durationMinutes: z.number().int().positive(),
        price: z.number().min(0).optional(),
        rating: z.number().min(0).max(5).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        provider: z.string().optional(),
        externalUrl: z.string().url().optional()
      })
    })
  ),
  discoveryController.createActivity
);
