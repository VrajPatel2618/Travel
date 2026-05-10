import { Router } from "express";

import { analyticsController } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard", authenticate, analyticsController.dashboard);
analyticsRouter.get("/admin", authenticate, requireRole("ADMIN"), analyticsController.admin);
