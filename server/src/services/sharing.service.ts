import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";
import { assertTripAccess } from "./trips.service";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
}

export const sharingService = {
  async create(tripId: string, user: Express.User, input: { slug?: string; isPublic?: boolean; expiresAt?: Date }) {
    await assertTripAccess(tripId, user);
    const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
    const slug = input.slug ?? `${slugify(trip.title)}-${trip.id.slice(-5)}`;

    return prisma.sharedTrip.upsert({
      where: { tripId },
      update: {
        slug,
        isPublic: input.isPublic ?? true,
        expiresAt: input.expiresAt,
        trip: { update: { visibility: input.isPublic === false ? "PRIVATE" : "PUBLIC" } }
      },
      create: {
        tripId,
        slug,
        isPublic: input.isPublic ?? true,
        expiresAt: input.expiresAt
      }
    });
  },

  async publicBySlug(slug: string) {
    const shared = await prisma.sharedTrip.findUnique({
      where: { slug },
      include: {
        trip: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            destinations: {
              orderBy: { position: "asc" },
              include: {
                city: true,
                tripActivities: { orderBy: [{ scheduledDate: "asc" }, { position: "asc" }] }
              }
            },
            notes: { where: { type: "JOURNAL" }, orderBy: { createdAt: "desc" }, take: 6 }
          }
        }
      }
    });

    if (!shared || !shared.isPublic || (shared.expiresAt && shared.expiresAt < new Date())) {
      throw new ApiError(404, "Shared trip not found");
    }

    await prisma.sharedTrip.update({
      where: { id: shared.id },
      data: { viewCount: { increment: 1 } }
    });

    return shared;
  }
};
