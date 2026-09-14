-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('FULL_PAY', 'AFFIRM');

-- CreateEnum
CREATE TYPE "ClientPaymentStatus" AS ENUM ('PAID_IN_FULL', 'ON_PLAN', 'LATE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'AT_RISK', 'PAUSED', 'COMPLETED', 'CHURNED', 'REFUNDED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadStatus" ADD VALUE 'NEW';
ALTER TYPE "LeadStatus" ADD VALUE 'DISQUALIFIED_QUIZ';
ALTER TYPE "LeadStatus" ADD VALUE 'BOOKED';
ALTER TYPE "LeadStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "LeadStatus" ADD VALUE 'RESCHEDULED';
ALTER TYPE "LeadStatus" ADD VALUE 'NO_SHOW';
ALTER TYPE "LeadStatus" ADD VALUE 'SHOWED_NO_CLOSE';
ALTER TYPE "LeadStatus" ADD VALUE 'UNQUALIFIED_ON_CALL';
ALTER TYPE "LeadStatus" ADD VALUE 'CLOSED_WON';

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "activeCampaignContactId" TEXT,
ADD COLUMN     "bookingMadeAt" TIMESTAMP(3),
ADD COLUMN     "callOutcomeAt" TIMESTAMP(3),
ADD COLUMN     "callScheduledFor" TIMESTAMP(3),
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "fbc" TEXT,
ADD COLUMN     "fbclid" TEXT,
ADD COLUMN     "fbp" TEXT,
ADD COLUMN     "financingFlag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstVisitAt" TIMESTAMP(3),
ADD COLUMN     "landingPage" TEXT,
ADD COLUMN     "leadCreatedAt" TIMESTAMP(3),
ADD COLUMN     "quizCompletedAt" TIMESTAMP(3),
ADD COLUMN     "quizStartedAt" TIMESTAMP(3),
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leadId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "timezone" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "fbclid" TEXT,
    "fbc" TEXT,
    "fbp" TEXT,
    "referrer" TEXT,
    "landingPage" TEXT,
    "financingFlag" BOOLEAN NOT NULL DEFAULT false,
    "contractValue" INTEGER,
    "cashCollected" INTEGER,
    "outstandingBalance" INTEGER,
    "paymentMethod" "PaymentMethod",
    "paymentStatus" "ClientPaymentStatus",
    "refundAmount" INTEGER,
    "refundDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "assignedConsultant" TEXT,
    "clientGoal" TEXT,
    "clientKpi" TEXT,
    "acquisitionSource" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'ONBOARDING',
    "testimonialConsent" BOOLEAN NOT NULL DEFAULT false,
    "testimonialConsentDate" TIMESTAMP(3),
    "figuresConsent" BOOLEAN NOT NULL DEFAULT false,
    "recordingConsent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_status_history" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_leadId_key" ON "clients"("leadId");

-- CreateIndex
CREATE INDEX "lead_status_history_leadId_idx" ON "lead_status_history"("leadId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
