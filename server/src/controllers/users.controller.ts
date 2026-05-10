import { usersService } from "../services/users.service";
import { asyncHandler } from "../utils/async-handler";
import { ok, pageMeta } from "../utils/response";

export const usersController = {
  me: asyncHandler(async (req, res) => ok(res, await usersService.me(req.user!.id))),

  updateMe: asyncHandler(async (req, res) =>
    ok(res, await usersService.update(req.user!.id, req.body), "Profile updated")
  ),

  changePassword: asyncHandler(async (req, res) => {
    await usersService.changePassword(req.user!.id, req.body);
    return ok(res, null, "Password changed");
  }),

  deleteMe: asyncHandler(async (req, res) => {
    await usersService.deleteAccount(req.user!.id);
    return ok(res, null, "Account deleted");
  }),

  adminList: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await usersService.adminList(page, limit, String(req.query.search ?? ""));
    return ok(res, {
      users: result.users,
      meta: pageMeta(page, limit, result.total)
    });
  })
};
