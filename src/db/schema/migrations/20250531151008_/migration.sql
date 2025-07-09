/*
  Warnings:

  - You are about to drop the column `content_preview` on the `posts` table. All the data in the column will be lost.
  - Added the required column `image_json` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content_preview",
ADD COLUMN     "image_json" JSONB NOT NULL;
