/*
  Warnings:

  - A unique constraint covering the columns `[authUserId]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "authUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "sellers_authUserId_key" ON "sellers"("authUserId");
