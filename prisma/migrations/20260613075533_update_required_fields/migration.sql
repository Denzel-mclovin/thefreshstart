/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `leads` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firstName` on table `leads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `leads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `leads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `leads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quizComment` on table `leads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "quizComment" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");
