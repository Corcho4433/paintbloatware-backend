/*
  Warnings:

  - Added the required column `height` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Ratings" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_post" TEXT NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
