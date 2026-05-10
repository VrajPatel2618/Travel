import { sharingService } from "../services/sharing.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok } from "../utils/response";

export const sharingController = {
  create: asyncHandler(async (req, res) =>
    created(
      res,
      await sharingService.create(String(req.params.tripId), req.user!, {
        ...req.body,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined
      }),
      "Share link created"
    )
  ),

  publicBySlug: asyncHandler(async (req, res) =>
    ok(res, await sharingService.publicBySlug(String(req.params.slug)), "Public itinerary")
  )
};
