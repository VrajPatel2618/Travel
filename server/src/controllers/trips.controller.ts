import type { TripStatus, TripVisibility, ActivityCategory } from "@prisma/client";

import { tripsService } from "../services/trips.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok, pageMeta } from "../utils/response";

export const tripsController = {
  list: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);
    const result = await tripsService.list(req.user!, {
      status: req.query.status as TripStatus | undefined,
      search: String(req.query.search ?? ""),
      page,
      limit
    });
    return ok(res, { trips: result.trips, meta: pageMeta(page, limit, result.total) });
  }),

  create: asyncHandler(async (req, res) =>
    created(
      res,
      await tripsService.create(req.user!.id, {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      }),
      "Trip created"
    )
  ),

  get: asyncHandler(async (req, res) => ok(res, await tripsService.get(String(req.params.id), req.user!))),

  update: asyncHandler(async (req, res) =>
    ok(
      res,
      await tripsService.update(String(req.params.id), req.user!, {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        status: req.body.status as TripStatus | undefined,
        visibility: req.body.visibility as TripVisibility | undefined
      }),
      "Trip updated"
    )
  ),

  remove: asyncHandler(async (req, res) => {
    await tripsService.remove(String(req.params.id), req.user!);
    return ok(res, null, "Trip deleted");
  }),

  addDestination: asyncHandler(async (req, res) =>
    created(
      res,
      await tripsService.addDestination(String(req.params.id), req.user!, {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      }),
      "Destination added"
    )
  ),

  reorderDestinations: asyncHandler(async (req, res) =>
    ok(
      res,
      await tripsService.reorderDestinations(String(req.params.id), req.user!, req.body.destinationIds),
      "Route reordered"
    )
  ),

  addActivity: asyncHandler(async (req, res) =>
    created(
      res,
      await tripsService.addActivity(String(req.params.id), req.user!, {
        ...req.body,
        category: req.body.category as ActivityCategory,
        scheduledDate: new Date(req.body.scheduledDate)
      }),
      "Activity added"
    )
  )
};
