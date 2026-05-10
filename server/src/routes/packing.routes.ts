import { Router } from "express";
import { z } from "zod";

import { packingController } from "../controllers/packing.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const packingCategory = z.enum([
  "CLOTHING",
  "ELECTRONICS",
  "DOCUMENTS",
  "ESSENTIALS",
  "TOILETRIES",
  "MEDICAL",
  "OTHER"
]);

export const packingRouter = Router();
packingRouter.use(authenticate);

packingRouter.get("/trips/:tripId", packingController.get);
packingRouter.post(
  "/trips/:tripId/items",
  validate(
    z.object({
      params: z.object({ tripId: z.string() }),
      body: z.object({
        category: packingCategory,
        name: z.string().min(2),
        quantity: z.number().int().positive().optional()
      })
    })
  ),
  packingController.addItem
);
packingRouter.patch(
  "/trips/:tripId/items/:itemId",
  validate(
    z.object({
      params: z.object({ tripId: z.string(), itemId: z.string() }),
      body: z.object({ isPacked: z.boolean() })
    })
  ),
  packingController.toggleItem
);
packingRouter.post("/trips/:tripId/reset", packingController.reset);
