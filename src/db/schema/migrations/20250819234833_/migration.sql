/*
  Warnings:

  - You are about to drop the `Ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_id_post_fkey";

-- DropForeignKey
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_id_user_fkey";

-- DropTable
DROP TABLE "Ratings";

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_post" TEXT NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
