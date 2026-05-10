import type { BudgetCategory } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { assertTripAccess } from "./trips.service";

export const budgetsService = {
  async get(tripId: string, user: Express.User) {
    await assertTripAccess(tripId, user);
    const budget = await prisma.budget.findUnique({
      where: { tripId },
      include: { items: { orderBy: { createdAt: "desc" } }, trip: { select: { title: true, budgetAmount: true } } }
    });

    const items = budget?.items ?? [];
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
    const byCategory = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount);
      return acc;
    }, {});
    const limit = Number(budget?.totalLimit ?? 0);

    return {
      budget,
      analytics: {
        total,
        limit,
        remaining: Math.max(0, limit - total),
        utilization: limit ? Math.round((total / limit) * 100) : 0,
        byCategory,
        insights: [
          total > limit
            ? `You are exceeding this trip budget by ${Math.round(((total - limit) / limit) * 100)}%.`
            : "Your current plan is within budget.",
          (byCategory.HOTELS ?? 0) > limit * 0.45
            ? "Hotels are consuming more than 45% of the total budget."
            : "Lodging spend is balanced against the rest of the itinerary."
        ]
      }
    };
  },

  async upsert(tripId: string, user: Express.User, input: { totalLimit: number; currency?: string }) {
    await assertTripAccess(tripId, user);
    return prisma.budget.upsert({
      where: { tripId },
      update: input,
      create: { tripId, ...input, spentAmount: 0 },
      include: { items: true }
    });
  },

  async addItem(
    tripId: string,
    user: Express.User,
    input: { category: BudgetCategory; name: string; amount: number; plannedDate?: Date; isPaid?: boolean }
  ) {
    await assertTripAccess(tripId, user);
    const budget = await prisma.budget.upsert({
      where: { tripId },
      update: {},
      create: { tripId, totalLimit: 0, spentAmount: 0 }
    });

    return prisma.budgetItem.create({
      data: {
        budgetId: budget.id,
        category: input.category,
        name: input.name,
        amount: input.amount,
        plannedDate: input.plannedDate,
        isPaid: input.isPaid ?? false
      }
    });
  }
};
