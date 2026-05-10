import type { PackingCategory } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { assertTripAccess } from "./trips.service";

export const packingService = {
  async get(tripId: string, user: Express.User) {
    await assertTripAccess(tripId, user);
    return prisma.packingList.upsert({
      where: { tripId },
      update: {},
      create: { tripId },
      include: { items: { orderBy: [{ category: "asc" }, { createdAt: "asc" }] } }
    });
  },

  async addItem(
    tripId: string,
    user: Express.User,
    input: { category: PackingCategory; name: string; quantity?: number }
  ) {
    await assertTripAccess(tripId, user);
    const list = await prisma.packingList.upsert({
      where: { tripId },
      update: {},
      create: { tripId }
    });
    return prisma.packingItem.create({
      data: {
        packingListId: list.id,
        category: input.category,
        name: input.name,
        quantity: input.quantity ?? 1
      }
    });
  },

  async toggleItem(tripId: string, user: Express.User, itemId: string, isPacked: boolean) {
    await assertTripAccess(tripId, user);
    return prisma.packingItem.update({ where: { id: itemId }, data: { isPacked } });
  },

  async reset(tripId: string, user: Express.User) {
    await assertTripAccess(tripId, user);
    const list = await prisma.packingList.findUniqueOrThrow({ where: { tripId } });
    await prisma.packingItem.updateMany({
      where: { packingListId: list.id },
      data: { isPacked: false }
    });
    return this.get(tripId, user);
  }
};
