import { prisma } from "../lib/prisma";

export const analyticsService = {
  async dashboard(userId: string) {
    const [trips, activeTrips, savedCities, notifications] = await prisma.$transaction([
      prisma.trip.findMany({
        where: { userId },
        include: {
          destinations: { include: { city: true }, orderBy: { position: "asc" } },
          budget: { include: { items: true } }
        },
        orderBy: { startDate: "asc" },
        take: 5
      }),
      prisma.trip.count({ where: { userId, status: { in: ["PLANNING", "BOOKED", "ACTIVE"] } } }),
      prisma.savedDestination.count({ where: { userId } }),
      prisma.notification.findMany({ where: { userId, readAt: null }, take: 8, orderBy: { createdAt: "desc" } })
    ]);

    const budgetExposure = trips.reduce((sum, trip) => sum + Number(trip.budgetAmount ?? 0), 0);

    return {
      activeTrips,
      savedCities,
      budgetExposure,
      upcomingTrips: trips,
      notifications,
      recommendations: [
        {
          title: "Optimize route timing",
          body: "Move Osaka one day later to reduce rain exposure and improve reservation availability.",
          type: "ROUTE"
        },
        {
          title: "Budget guardrail",
          body: "Food and hotel categories are trending higher than planned in premium cities.",
          type: "BUDGET"
        }
      ]
    };
  },

  async admin() {
    const [
      totalUsers,
      totalTrips,
      sharedTrips,
      activities,
      popularCities,
      recentUsers,
      tripsByStatus
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.sharedTrip.count({ where: { isPublic: true } }),
      prisma.activity.count(),
      prisma.city.findMany({
        orderBy: { popularityScore: "desc" },
        take: 8,
        include: { _count: { select: { tripDestinations: true, savedBy: true } } }
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      }),
      prisma.trip.groupBy({
        by: ["status"],
        orderBy: { status: "asc" },
        _count: { status: true }
      })
    ]);

    return {
      metrics: {
        totalUsers,
        totalTrips,
        sharedTrips,
        activities
      },
      popularCities,
      recentUsers,
      tripsByStatus
    };
  }
};
