import type { ActivityCategory, TripStatus, TripVisibility } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

export async function assertTripAccess(tripId: string, user: Express.User) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true }
  });
  if (!trip) throw new ApiError(404, "Trip not found");
  if (trip.userId !== user.id && user.role !== "ADMIN") {
    throw new ApiError(403, "You do not have access to this trip");
  }
  return trip;
}

const tripInclude = {
  destinations: {
    orderBy: { position: "asc" as const },
    include: {
      city: true,
      tripActivities: { orderBy: [{ scheduledDate: "asc" as const }, { position: "asc" as const }] }
    }
  },
  budget: { include: { items: true } },
  packingList: { include: { items: true } },
  sharedTrip: true,
  _count: { select: { notes: true } }
};

export const tripsService = {
  async list(user: Express.User, query: { status?: TripStatus; search?: string; page: number; limit: number }) {
    const where = {
      userId: user.id,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" as const } },
              { description: { contains: query.search, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [trips, total] = await prisma.$transaction([
      prisma.trip.findMany({
        where,
        include: tripInclude,
        orderBy: { startDate: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.trip.count({ where })
    ]);

    return { trips, total };
  },

  async create(
    userId: string,
    input: {
      title: string;
      description?: string;
      coverImageUrl?: string;
      startDate: Date;
      endDate: Date;
      budgetAmount?: number;
      currency?: string;
      destinationIds?: string[];
    }
  ) {
    const trip = await prisma.trip.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        coverImageUrl: input.coverImageUrl,
        startDate: input.startDate,
        endDate: input.endDate,
        budgetAmount: input.budgetAmount,
        currency: input.currency ?? "USD",
        budget: input.budgetAmount
          ? { create: { totalLimit: input.budgetAmount, spentAmount: 0, currency: input.currency ?? "USD" } }
          : undefined,
        packingList: { create: { title: `${input.title} packing list` } },
        destinations: input.destinationIds?.length
          ? {
              create: input.destinationIds.map((cityId, index) => ({
                cityId,
                position: index + 1,
                startDate: input.startDate,
                endDate: input.endDate,
                stayNights: Math.max(
                  1,
                  Math.ceil((input.endDate.getTime() - input.startDate.getTime()) / 86_400_000)
                )
              }))
            }
          : undefined
      },
      include: tripInclude
    });

    return trip;
  },

  async get(id: string, user: Express.User) {
    await assertTripAccess(id, user);
    return prisma.trip.findUniqueOrThrow({ where: { id }, include: tripInclude });
  },

  async update(
    id: string,
    user: Express.User,
    input: Partial<{
      title: string;
      description: string;
      coverImageUrl: string;
      startDate: Date;
      endDate: Date;
      budgetAmount: number;
      status: TripStatus;
      visibility: TripVisibility;
    }>
  ) {
    await assertTripAccess(id, user);
    return prisma.trip.update({ where: { id }, data: input, include: tripInclude });
  },

  async remove(id: string, user: Express.User) {
    await assertTripAccess(id, user);
    await prisma.trip.delete({ where: { id } });
  },

  async addDestination(
    tripId: string,
    user: Express.User,
    input: { cityId: string; startDate: Date; endDate: Date; stayNights: number; transportMode?: string }
  ) {
    await assertTripAccess(tripId, user);
    const last = await prisma.tripDestination.findFirst({
      where: { tripId },
      orderBy: { position: "desc" }
    });

    return prisma.tripDestination.create({
      data: {
        tripId,
        cityId: input.cityId,
        position: (last?.position ?? 0) + 1,
        startDate: input.startDate,
        endDate: input.endDate,
        stayNights: input.stayNights,
        transportMode: input.transportMode
      },
      include: { city: true, tripActivities: true }
    });
  },

  async reorderDestinations(tripId: string, user: Express.User, destinationIds: string[]) {
    await assertTripAccess(tripId, user);
    await prisma.$transaction(
      destinationIds.map((id, index) =>
        prisma.tripDestination.update({
          where: { id },
          data: { position: index + 1 }
        })
      )
    );
    return this.get(tripId, user);
  },

  async addActivity(
    tripId: string,
    user: Express.User,
    input: {
      tripDestinationId: string;
      activityId?: string;
      title: string;
      category: ActivityCategory;
      scheduledDate: Date;
      startTime?: string;
      durationMinutes: number;
      estimatedCost?: number;
      notes?: string;
    }
  ) {
    await assertTripAccess(tripId, user);
    const destination = await prisma.tripDestination.findFirst({
      where: { id: input.tripDestinationId, tripId }
    });
    if (!destination) throw new ApiError(404, "Trip destination not found");

    return prisma.tripActivity.create({
      data: {
        tripDestinationId: input.tripDestinationId,
        activityId: input.activityId,
        title: input.title,
        category: input.category,
        scheduledDate: input.scheduledDate,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        estimatedCost: input.estimatedCost ?? 0,
        notes: input.notes
      }
    });
  }
};
