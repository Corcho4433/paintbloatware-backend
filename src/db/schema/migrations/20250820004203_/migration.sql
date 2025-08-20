/*
  Warnings:

  - You are about to drop the column `image_json` on the `posts` table. All the data in the column will be lost.
  - Added the required column `url_bucket` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "image_json",
ADD COLUMN     "url_bucket" TEXT NOT NULL;
