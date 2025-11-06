/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_transactionId_key" ON "public"."subscriptions"("transactionId");
