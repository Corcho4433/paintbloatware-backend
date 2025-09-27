/*
  Warnings:

  - You are about to drop the column `height` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ratings` table. All the data in the column will be lost.
  - Added the required column `description` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "height",
DROP COLUMN "title",
DROP COLUMN "version",
DROP COLUMN "width",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."ratings" DROP COLUMN "createdAt",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "description" TEXT,
ADD COLUMN     "urlPfp" TEXT;

-- CreateTable
CREATE TABLE "public"."comment_threads" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_comment" TEXT NOT NULL,

    CONSTRAINT "comment_threads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."comment_threads" ADD CONSTRAINT "comment_threads_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_threads" ADD CONSTRAINT "comment_threads_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "public"."comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
