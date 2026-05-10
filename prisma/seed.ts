import { PrismaClient, ActivityCategory, BudgetCategory, PackingCategory, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Traveloop123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@traveloop.ai" },
    update: {},
    create: {
      name: "Traveloop Admin",
      email: "admin@traveloop.ai",
      passwordHash,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date()
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "maya@traveloop.ai" },
    update: {},
    create: {
      name: "Maya Chen",
      email: "maya@traveloop.ai",
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      emailVerifiedAt: new Date(),
      preferences: { homeAirport: "SFO", currency: "USD", travelStyle: ["food", "culture", "design"] }
    }
  });

  await prisma.$transaction([
    prisma.trip.deleteMany({ where: { userId: user.id, title: "Spring in Japan" } }),
    prisma.notification.deleteMany({
      where: {
        userId: { in: [admin.id, user.id] },
        title: { in: ["Admin workspace ready", "Budget alert"] }
      }
    }),
    prisma.activity.deleteMany({
      where: {
        title: { in: ["Tsukiji breakfast walk", "Gion lantern route", "Dotonbori food loop"] }
      }
    })
  ]);

  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: "SYSTEM",
        title: "Admin workspace ready",
        body: "Seed metrics and sample trips are available."
      },
      {
        userId: user.id,
        type: "BUDGET",
        title: "Budget alert",
        body: "You are exceeding your Paris budget by 18%."
      }
    ],
    skipDuplicates: true
  });

  const cityData = [
    {
      name: "Tokyo",
      country: "Japan",
      region: "Kanto",
      latitude: 35.6762,
      longitude: 139.6503,
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      popularityScore: 96,
      costIndex: 78,
      weatherSummary: "21 C, cloudy",
      bestMonths: ["March", "April", "November"],
      description: "Neon neighborhoods, design shops, food alleys, and high-speed transit."
    },
    {
      name: "Kyoto",
      country: "Japan",
      region: "Kansai",
      latitude: 35.0116,
      longitude: 135.7681,
      imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
      popularityScore: 94,
      costIndex: 72,
      weatherSummary: "18 C, clear",
      bestMonths: ["April", "May", "October"],
      description: "Temples, tea houses, gardens, and slow mornings."
    },
    {
      name: "Osaka",
      country: "Japan",
      region: "Kansai",
      latitude: 34.6937,
      longitude: 135.5023,
      imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80",
      popularityScore: 89,
      costIndex: 68,
      weatherSummary: "20 C, breezy",
      bestMonths: ["April", "October", "November"],
      description: "Street food, castle gardens, nightlife, and easy regional trains."
    },
    {
      name: "Paris",
      country: "France",
      region: "Ile-de-France",
      latitude: 48.8566,
      longitude: 2.3522,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      popularityScore: 98,
      costIndex: 84,
      weatherSummary: "19 C, clear",
      bestMonths: ["May", "June", "September"],
      description: "Art, restaurants, architecture, and walkable neighborhoods."
    }
  ];

  const cities = await Promise.all(
    cityData.map((city) =>
      prisma.city.upsert({
        where: { name_country: { name: city.name, country: city.country } },
        update: city,
        create: city
      })
    )
  );

  const [tokyo, kyoto, osaka] = cities;

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        cityId: tokyo.id,
        title: "Tsukiji breakfast walk",
        category: ActivityCategory.FOOD,
        durationMinutes: 120,
        price: 38,
        rating: 4.8,
        description: "Small-group tasting route across classic breakfast counters.",
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80"
      }
    }),
    prisma.activity.create({
      data: {
        cityId: kyoto.id,
        title: "Gion lantern route",
        category: ActivityCategory.CULTURE,
        durationMinutes: 90,
        price: 18,
        rating: 4.9,
        description: "Evening walk through preserved streets and tea houses.",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80"
      }
    }),
    prisma.activity.create({
      data: {
        cityId: osaka.id,
        title: "Dotonbori food loop",
        category: ActivityCategory.FOOD,
        durationMinutes: 150,
        price: 46,
        rating: 4.7,
        description: "Street food highlights with a reservation-friendly route.",
        imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=900&q=80"
      }
    })
  ]);

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "Spring in Japan",
      description: "Food, culture, quiet hotels, design shops, and an art island extension.",
      coverImageUrl: kyoto.imageUrl,
      startDate: new Date("2026-04-02T00:00:00.000Z"),
      endDate: new Date("2026-04-13T00:00:00.000Z"),
      budgetAmount: 5680,
      currency: "USD",
      status: "PLANNING",
      aiSummary: "A balanced 11-day Japan loop with food-focused city days and low-risk transfers."
    }
  });

  const destinations = await Promise.all([
    prisma.tripDestination.create({
      data: {
        tripId: trip.id,
        cityId: tokyo.id,
        position: 1,
        startDate: new Date("2026-04-02T00:00:00.000Z"),
        endDate: new Date("2026-04-05T00:00:00.000Z"),
        stayNights: 3,
        transportMode: "Arrive HND"
      }
    }),
    prisma.tripDestination.create({
      data: {
        tripId: trip.id,
        cityId: kyoto.id,
        position: 2,
        startDate: new Date("2026-04-05T00:00:00.000Z"),
        endDate: new Date("2026-04-09T00:00:00.000Z"),
        stayNights: 4,
        transportMode: "Shinkansen"
      }
    }),
    prisma.tripDestination.create({
      data: {
        tripId: trip.id,
        cityId: osaka.id,
        position: 3,
        startDate: new Date("2026-04-09T00:00:00.000Z"),
        endDate: new Date("2026-04-11T00:00:00.000Z"),
        stayNights: 2,
        transportMode: "Rapid train"
      }
    })
  ]);

  await Promise.all(
    destinations.map((destination, index) =>
      prisma.tripActivity.create({
        data: {
          tripDestinationId: destination.id,
          activityId: activities[index].id,
          title: activities[index].title,
          category: activities[index].category,
          scheduledDate: destination.startDate,
          startTime: index === 0 ? "09:00" : index === 1 ? "18:30" : "20:00",
          durationMinutes: activities[index].durationMinutes,
          estimatedCost: activities[index].price,
          position: index + 1
        }
      })
    )
  );

  await prisma.budget.create({
    data: {
      tripId: trip.id,
      totalLimit: 6000,
      spentAmount: 4720,
      items: {
        create: [
          { category: BudgetCategory.FLIGHTS, name: "Round-trip flights", amount: 1640, isPaid: true },
          { category: BudgetCategory.HOTELS, name: "Hotels", amount: 2180 },
          { category: BudgetCategory.FOOD, name: "Food plan", amount: 760 },
          { category: BudgetCategory.ACTIVITIES, name: "Activities", amount: 680 }
        ]
      }
    }
  });

  await prisma.packingList.create({
    data: {
      tripId: trip.id,
      items: {
        create: [
          { category: PackingCategory.DOCUMENTS, name: "Passport", isPacked: true },
          { category: PackingCategory.DOCUMENTS, name: "Travel insurance" },
          { category: PackingCategory.CLOTHING, name: "Rain shell", isPacked: true },
          { category: PackingCategory.ELECTRONICS, name: "Universal adapter" }
        ]
      }
    }
  });

  await prisma.note.create({
    data: {
      userId: user.id,
      tripId: trip.id,
      type: "JOURNAL",
      title: "Kyoto shifted the pace",
      content: "Moved the bamboo grove to sunrise and added a quiet tea house AI found two streets away.",
      dayIndex: 4
    }
  });

  await prisma.sharedTrip.upsert({
    where: { slug: "japan-loop" },
    update: { tripId: trip.id, isPublic: true },
    create: { tripId: trip.id, slug: "japan-loop", isPublic: true }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
