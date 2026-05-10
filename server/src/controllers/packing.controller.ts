import type { PackingCategory } from "@prisma/client";

import { packingService } from "../services/packing.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok } from "../utils/response";

export const packingController = {
  get: asyncHandler(async (req, res) => ok(res, await packingService.get(String(req.params.tripId), req.user!))),

  addItem: asyncHandler(async (req, res) =>
    created(
      res,
      await packingService.addItem(String(req.params.tripId), req.user!, {
        ...req.body,
        category: req.body.category as PackingCategory
      }),
      "Packing item added"
    )
  ),

  toggleItem: asyncHandler(async (req, res) =>
    ok(
      res,
      await packingService.toggleItem(
        String(req.params.tripId),
        req.user!,
        String(req.params.itemId),
        req.body.isPacked
      ),
      "Packing item updated"
    )
  ),

  reset: asyncHandler(async (req, res) =>
    ok(res, await packingService.reset(String(req.params.tripId), req.user!), "Packing list reset")
  )
};
