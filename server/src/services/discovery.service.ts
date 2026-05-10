import type { ActivityCategory } from "@prisma/client";

import { prisma } from "../lib/prisma";

export const discoveryService = {
  async cities(query: {
    search?: string;
    country?: string;
    maxCostIndex?: number;
    minPopularity?: number;
    page: number;
    limit: number;
  }) {
    const where = {
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" as const } },
              { country: { contains: query.search, mode: "insensitive" as const } },
              { description: { contains: query.search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(query.country ? { country: { equals: query.country, mode: "insensitive" as const } } : {}),
      ...(query.maxCostIndex ? { costIndex: { lte: query.maxCostIndex } } : {}),
      ...(query.minPopularity ? { popularityScore: { gte: query.minPopularity } } : {})
    };

    const [cities, total] = await prisma.$transaction([
      prisma.city.findMany({
        where,
        orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.city.count({ where })
    ]);

    return { cities, total };
  },

  async createCity(input: {
    name: string;
    country: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    popularityScore?: number;
    costIndex?: number;
    weatherSummary?: string;
    bestMonths?: string[];
    description?: string;
  }) {
    return prisma.city.create({ data: input });
  },

  async saveCity(userId: string, cityId: string) {
    return prisma.savedDestination.upsert({
      where: { userId_cityId: { userId, cityId } },
      update: {},
      create: { userId, cityId },
      include: { city: true }
    });
  },

  async unsaveCity(userId: string, cityId: string) {
    await prisma.savedDestination.delete({ where: { userId_cityId: { userId, cityId } } });
  },

  async activities(query: {
    search?: string;
    cityId?: string;
    category?: ActivityCategory;
    maxPrice?: number;
    page: number;
    limit: number;
  }) {
    const where = {
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" as const } },
              { description: { contains: query.search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(query.cityId ? { cityId: query.cityId } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.maxPrice ? { price: { lte: query.maxPrice } } : {})
    };

    const [activities, total] = await prisma.$transaction([
      prisma.activity.findMany({
        where,
        include: { city: true },
        orderBy: [{ rating: "desc" }, { title: "asc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.activity.count({ where })
    ]);

    return { activities, total };
  },

  async createActivity(input: {
    cityId?: string;
    title: string;
    category: ActivityCategory;
    durationMinutes: number;
    price?: number;
    rating?: number;
    description?: string;
    imageUrl?: string;
    provider?: string;
    externalUrl?: string;
  }) {
    return prisma.activity.create({ data: input, include: { city: true } });
  }
};
