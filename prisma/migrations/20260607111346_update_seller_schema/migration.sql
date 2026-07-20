/*
  Warnings:

  - The `approved` column on the `sellers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "approved",
ADD COLUMN     "approved" "SellerStatus" NOT NULL DEFAULT 'PENDING';
