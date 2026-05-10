import { analyticsService } from "../services/analytics.service";
import { asyncHandler } from "../utils/async-handler";
import { ok } from "../utils/response";

export const analyticsController = {
  dashboard: asyncHandler(async (req, res) =>
    ok(res, await analyticsService.dashboard(req.user!.id), "Dashboard analytics")
  ),

  admin: asyncHandler(async (_req, res) =>
    ok(res, await analyticsService.admin(), "Platform analytics")
  )
};
