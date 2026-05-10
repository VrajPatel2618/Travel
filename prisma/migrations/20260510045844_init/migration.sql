-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PLANNING', 'BOOKED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TripVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'UNLISTED');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('ADVENTURE', 'FOOD', 'BEACHES', 'HIKING', 'MUSEUMS', 'NIGHTLIFE', 'CULTURE', 'WELLNESS', 'SHOPPING', 'TRANSIT');

-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('FLIGHTS', 'HOTELS', 'TRANSPORT', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "PackingCategory" AS ENUM ('CLOTHING', 'ELECTRONICS', 'DOCUMENTS', 'ESSENTIALS', 'TOILETRIES', 'MEDICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('JOURNAL', 'REMINDER', 'MEMORY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'TRIP', 'BUDGET', 'SHARE', 'SECURITY');

-- CreateEnum
CREATE TYPE "AuthTokenType" AS ENUM ('REFRESH', 'EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerifiedAt" TIMESTAMP(3),
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "AuthTokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "imageUrl" TEXT,
    "popularityScore" INTEGER NOT NULL DEFAULT 70,
    "costIndex" INTEGER NOT NULL DEFAULT 50,
    "weatherSummary" TEXT,
    "bestMonths" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budgetAmount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "TripStatus" NOT NULL DEFAULT 'PLANNING',
    "visibility" "TripVisibility" NOT NULL DEFAULT 'PRIVATE',
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripDestination" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "stayNights" INTEGER NOT NULL,
    "transportMode" TEXT,
    "transportCost" DECIMAL(10,2),
    "notes" TEXT,

    CONSTRAINT "TripDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "cityId" TEXT,
    "title" TEXT NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 4.5,
    "description" TEXT,
    "imageUrl" TEXT,
    "provider" TEXT,
    "externalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripActivity" (
    "id" TEXT NOT NULL,
    "tripDestinationId" TEXT NOT NULL,
    "activityId" TEXT,
    "title" TEXT NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "estimatedCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "TripActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalLimit" DECIMAL(12,2) NOT NULL,
    "spentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "category" "BudgetCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "plannedDate" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingList" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Trip packing list',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingItem" (
    "id" TEXT NOT NULL,
    "packingListId" TEXT NOT NULL,
    "category" "PackingCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT,
    "tripDestinationId" TEXT,
    "type" "NoteType" NOT NULL DEFAULT 'JOURNAL',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" JSONB,
    "dayIndex" INTEGER,
    "reminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedTrip" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedDestination" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthToken_userId_type_idx" ON "AuthToken"("userId", "type");

-- CreateIndex
CREATE INDEX "AuthToken_expiresAt_idx" ON "AuthToken"("expiresAt");

-- CreateIndex
CREATE INDEX "City_country_idx" ON "City"("country");

-- CreateIndex
CREATE INDEX "City_popularityScore_idx" ON "City"("popularityScore");

-- CreateIndex
CREATE INDEX "City_costIndex_idx" ON "City"("costIndex");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_country_key" ON "City"("name", "country");

-- CreateIndex
CREATE INDEX "Trip_userId_status_idx" ON "Trip"("userId", "status");

-- CreateIndex
CREATE INDEX "Trip_startDate_endDate_idx" ON "Trip"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Trip_visibility_idx" ON "Trip"("visibility");

-- CreateIndex
CREATE INDEX "TripDestination_tripId_idx" ON "TripDestination"("tripId");

-- CreateIndex
CREATE INDEX "TripDestination_cityId_idx" ON "TripDestination"("cityId");

-- CreateIndex
CREATE INDEX "TripDestination_startDate_endDate_idx" ON "TripDestination"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "TripDestination_tripId_position_key" ON "TripDestination"("tripId", "position");

-- CreateIndex
CREATE INDEX "Activity_cityId_idx" ON "Activity"("cityId");

-- CreateIndex
CREATE INDEX "Activity_category_idx" ON "Activity"("category");

-- CreateIndex
CREATE INDEX "Activity_rating_idx" ON "Activity"("rating");

-- CreateIndex
CREATE INDEX "TripActivity_tripDestinationId_scheduledDate_idx" ON "TripActivity"("tripDestinationId", "scheduledDate");

-- CreateIndex
CREATE INDEX "TripActivity_activityId_idx" ON "TripActivity"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_tripId_key" ON "Budget"("tripId");

-- CreateIndex
CREATE INDEX "BudgetItem_budgetId_category_idx" ON "BudgetItem"("budgetId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_tripId_key" ON "PackingList"("tripId");

-- CreateIndex
CREATE INDEX "PackingItem_packingListId_category_idx" ON "PackingItem"("packingListId", "category");

-- CreateIndex
CREATE INDEX "Note_userId_type_idx" ON "Note"("userId", "type");

-- CreateIndex
CREATE INDEX "Note_tripId_idx" ON "Note"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedTrip_tripId_key" ON "SharedTrip"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedTrip_slug_key" ON "SharedTrip"("slug");

-- CreateIndex
CREATE INDEX "SharedTrip_slug_isPublic_idx" ON "SharedTrip"("slug", "isPublic");

-- CreateIndex
CREATE INDEX "SavedDestination_cityId_idx" ON "SavedDestination"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedDestination_userId_cityId_key" ON "SavedDestination"("userId", "cityId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Review_activityId_idx" ON "Review"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_activityId_key" ON "Review"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripDestination" ADD CONSTRAINT "TripDestination_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripDestination" ADD CONSTRAINT "TripDestination_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripActivity" ADD CONSTRAINT "TripActivity_tripDestinationId_fkey" FOREIGN KEY ("tripDestinationId") REFERENCES "TripDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripActivity" ADD CONSTRAINT "TripActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingItem" ADD CONSTRAINT "PackingItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_tripDestinationId_fkey" FOREIGN KEY ("tripDestinationId") REFERENCES "TripDestination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedTrip" ADD CONSTRAINT "SharedTrip_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDestination" ADD CONSTRAINT "SavedDestination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDestination" ADD CONSTRAINT "SavedDestination_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
