/*
  Warnings:

  - You are about to drop the column `session_token` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_user,refresh_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sessions_id_user_session_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "session_token",
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_user_refresh_token_key" ON "sessions"("id_user", "refresh_token");
