/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `leads` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "quizAttempts" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "leads_sessionId_key" ON "leads"("sessionId");
