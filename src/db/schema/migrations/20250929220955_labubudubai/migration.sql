/*
  Warnings:

  - Added the required column `like_count` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "like_count" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ratings" ADD COLUMN     "like_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
