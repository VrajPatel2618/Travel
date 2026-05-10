import type { ActivityCategory } from "@prisma/client";

import { discoveryService } from "../services/discovery.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok, pageMeta } from "../utils/response";

export const discoveryController = {
  cities: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await discoveryService.cities({
      search: String(req.query.search ?? ""),
      country: req.query.country ? String(req.query.country) : undefined,
      maxCostIndex: req.query.maxCostIndex ? Number(req.query.maxCostIndex) : undefined,
      minPopularity: req.query.minPopularity ? Number(req.query.minPopularity) : undefined,
      page,
      limit
    });
    return ok(res, { cities: result.cities, meta: pageMeta(page, limit, result.total) });
  }),

  createCity: asyncHandler(async (req, res) =>
    created(res, await discoveryService.createCity(req.body), "City created")
  ),

  saveCity: asyncHandler(async (req, res) =>
    created(res, await discoveryService.saveCity(req.user!.id, String(req.params.cityId)), "Destination saved")
  ),

  unsaveCity: asyncHandler(async (req, res) => {
    await discoveryService.unsaveCity(req.user!.id, String(req.params.cityId));
    return ok(res, null, "Destination removed");
  }),

  activities: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await discoveryService.activities({
      search: String(req.query.search ?? ""),
      cityId: req.query.cityId ? String(req.query.cityId) : undefined,
      category: req.query.category as ActivityCategory | undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page,
      limit
    });
    return ok(res, { activities: result.activities, meta: pageMeta(page, limit, result.total) });
  }),

  createActivity: asyncHandler(async (req, res) =>
    created(
      res,
      await discoveryService.createActivity({
        ...req.body,
        category: req.body.category as ActivityCategory
      }),
      "Activity created"
    )
  )
};
