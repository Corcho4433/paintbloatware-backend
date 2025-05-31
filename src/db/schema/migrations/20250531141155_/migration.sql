/*
  Warnings:

  - Added the required column `content_preview` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "content_preview" BYTEA NOT NULL;
