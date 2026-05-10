import type { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/security";
import { sanitizeUser } from "./auth.service";
import { ApiError } from "../utils/api-error";

export const usersService = {
  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedCities: { include: { city: true } },
        notifications: { orderBy: { createdAt: "desc" }, take: 10 }
      }
    });
    if (!user) throw new ApiError(404, "User not found");
    return sanitizeUser(user);
  },

  async update(userId: string, input: { name?: string; avatarUrl?: string; preferences?: Prisma.InputJsonValue }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: input
    });
    return sanitizeUser(user);
  },

  async changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!valid) throw new ApiError(400, "Current password is incorrect");

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hashPassword(input.newPassword) }
    });
  },

  async deleteAccount(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
  },

  async adminList(page: number, limit: number, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } }
          ]
        }
      : {};

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
          emailVerifiedAt: true,
          createdAt: true,
          _count: { select: { trips: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }
};
