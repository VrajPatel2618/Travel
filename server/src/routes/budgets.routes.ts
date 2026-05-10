import { Router } from "express";
import { z } from "zod";

import { budgetsController } from "../controllers/budgets.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const budgetCategory = z.enum([
  "FLIGHTS",
  "HOTELS",
  "TRANSPORT",
  "FOOD",
  "ACTIVITIES",
  "SHOPPING",
  "INSURANCE",
  "OTHER"
]);

export const budgetsRouter = Router();
budgetsRouter.use(authenticate);

budgetsRouter.get("/trips/:tripId", budgetsController.get);
budgetsRouter.put(
  "/trips/:tripId",
  validate(
    z.object({
      params: z.object({ tripId: z.string() }),
      body: z.object({
        totalLimit: z.number().min(0),
        currency: z.string().length(3).optional()
      })
    })
  ),
  budgetsController.upsert
);
budgetsRouter.post(
  "/trips/:tripId/items",
  validate(
    z.object({
      params: z.object({ tripId: z.string() }),
      body: z.object({
        category: budgetCategory,
        name: z.string().min(2),
        amount: z.number().min(0),
        plannedDate: z.string().datetime().optional(),
        isPaid: z.boolean().optional()
      })
    })
  ),
  budgetsController.addItem
);
