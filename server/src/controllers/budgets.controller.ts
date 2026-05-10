import type { BudgetCategory } from "@prisma/client";

import { budgetsService } from "../services/budgets.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok } from "../utils/response";

export const budgetsController = {
  get: asyncHandler(async (req, res) =>
    ok(res, await budgetsService.get(String(req.params.tripId), req.user!))
  ),

  upsert: asyncHandler(async (req, res) =>
    ok(res, await budgetsService.upsert(String(req.params.tripId), req.user!, req.body), "Budget saved")
  ),

  addItem: asyncHandler(async (req, res) =>
    created(
      res,
      await budgetsService.addItem(String(req.params.tripId), req.user!, {
        ...req.body,
        category: req.body.category as BudgetCategory,
        plannedDate: req.body.plannedDate ? new Date(req.body.plannedDate) : undefined
      }),
      "Budget item added"
    )
  )
};
