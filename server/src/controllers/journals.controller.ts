import type { NoteType } from "@prisma/client";

import { journalsService } from "../services/journals.service";
import { asyncHandler } from "../utils/async-handler";
import { created, ok, pageMeta } from "../utils/response";

export const journalsController = {
  list: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await journalsService.list(req.user!, {
      tripId: req.query.tripId ? String(req.query.tripId) : undefined,
      page,
      limit
    });
    return ok(res, { notes: result.notes, meta: pageMeta(page, limit, result.total) });
  }),

  create: asyncHandler(async (req, res) =>
    created(
      res,
      await journalsService.create(req.user!, {
        ...req.body,
        type: req.body.type as NoteType | undefined,
        reminderAt: req.body.reminderAt ? new Date(req.body.reminderAt) : undefined
      }),
      "Journal entry created"
    )
  ),

  update: asyncHandler(async (req, res) =>
    ok(res, await journalsService.update(req.user!, String(req.params.noteId), req.body), "Journal entry updated")
  ),

  remove: asyncHandler(async (req, res) => {
    await journalsService.remove(req.user!, String(req.params.noteId));
    return ok(res, null, "Journal entry deleted");
  })
};
