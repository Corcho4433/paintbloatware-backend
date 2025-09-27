/*
  Warnings:

  - You are about to drop the column `id_tag` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_id_tag_fkey";

-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "id_tag";

-- CreateTable
CREATE TABLE "public"."tagsForPost" (
    "id" TEXT NOT NULL,
    "id_tag" TEXT NOT NULL,
    "id_post" TEXT NOT NULL,

    CONSTRAINT "tagsForPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."tagsForPost" ADD CONSTRAINT "tagsForPost_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tagsForPost" ADD CONSTRAINT "tagsForPost_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "public"."tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
