/*
  Warnings:

  - You are about to drop the column `like_count` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `like_date` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."TelemetryEventType" AS ENUM ('USER_SIGNUP', 'USER_LOGIN', 'USER_LOGOUT', 'USER_PROFILE_UPDATE', 'POST_CREATED', 'POST_DELETED', 'POST_LIKED', 'POST_UNLIKED', 'POST_COMMENTED', 'COMMENT_DELETED', 'POST_SHARED', 'POST_SAVED', 'POST_UNSAVED', 'ERROR_OCCURRED', 'API_REQUEST', 'API_RESPONSE', 'APP_CRASHED', 'LATENCY_MEASURED', 'AD_IMPRESSION', 'AD_CLICK', 'WATCH_TIME');

-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "like_count";

-- AlterTable
ALTER TABLE "public"."ratings" DROP COLUMN "like_date";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Account";

-- CreateTable
CREATE TABLE "public"."telemetryEvent" (
    "id" TEXT NOT NULL,
    "eventType" "public"."TelemetryEventType" NOT NULL,
    "userId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "telemetryEvent_pkey" PRIMARY KEY ("id")
);
