/*
  Warnings:

  - Added the required column `id_tag` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "id_tag" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "public"."tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
