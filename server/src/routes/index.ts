import { Router } from "express";

import { analyticsRouter } from "./analytics.routes";
import { authRouter } from "./auth.routes";
import { budgetsRouter } from "./budgets.routes";
import { activitiesRouter, citiesRouter } from "./discovery.routes";
import { journalsRouter } from "./journals.routes";
import { packingRouter } from "./packing.routes";
import { sharingRouter } from "./sharing.routes";
import { tripsRouter } from "./trips.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "Traveloop API",
    version: "1.0.0",
    modules: [
      "auth",
      "users",
      "trips",
      "cities",
      "activities",
      "budgets",
      "packing",
      "journals",
      "sharing",
      "analytics"
    ]
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/trips", tripsRouter);
apiRouter.use("/cities", citiesRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/budgets", budgetsRouter);
apiRouter.use("/packing", packingRouter);
apiRouter.use("/journals", journalsRouter);
apiRouter.use("/sharing", sharingRouter);
apiRouter.use("/analytics", analyticsRouter);
