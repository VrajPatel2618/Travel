import { Prisma, type NoteType } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";
import { assertTripAccess } from "./trips.service";

export const journalsService = {
  async list(user: Express.User, query: { tripId?: string; page: number; limit: number }) {
    if (query.tripId) await assertTripAccess(query.tripId, user);
    const where = { userId: user.id, ...(query.tripId ? { tripId: query.tripId } : {}) };
    const [notes, total] = await prisma.$transaction([
      prisma.note.findMany({
        where,
        include: { trip: { select: { title: true } }, tripDestination: { include: { city: true } } },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.note.count({ where })
    ]);
    return { notes, total };
  },

  async create(
    user: Express.User,
    input: {
      tripId?: string;
      tripDestinationId?: string;
      type?: NoteType;
      title: string;
      content: string;
      images?: Prisma.InputJsonValue;
      dayIndex?: number;
      reminderAt?: Date;
    }
  ) {
    if (input.tripId) await assertTripAccess(input.tripId, user);
    return prisma.note.create({
      data: {
        userId: user.id,
        ...input
      }
    });
  },

  async update(
    user: Express.User,
    noteId: string,
    input: Partial<{ title: string; content: string; images: Prisma.InputJsonValue }>
  ) {
    const note = await prisma.note.findUniqueOrThrow({ where: { id: noteId } });
    if (note.userId !== user.id && user.role !== "ADMIN") throw new ApiError(403, "Forbidden");
    return prisma.note.update({ where: { id: noteId }, data: input });
  },

  async remove(user: Express.User, noteId: string) {
    const note = await prisma.note.findUniqueOrThrow({ where: { id: noteId } });
    if (note.userId !== user.id && user.role !== "ADMIN") throw new ApiError(403, "Forbidden");
    await prisma.note.delete({ where: { id: noteId } });
  }
};
