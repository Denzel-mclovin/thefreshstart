-- CreateEnum
CREATE TYPE "CalendlyWebhookStatus" AS ENUM ('PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "CalendlyEventType" AS ENUM ('INVITEE_CREATED', 'INVITEE_CANCELED');

-- CreateTable
CREATE TABLE "calendly_webhook_events" (
    "id" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventType" "CalendlyEventType" NOT NULL,
    "inviteeUri" TEXT NOT NULL,
    "scheduledEventUri" TEXT,
    "status" "CalendlyWebhookStatus" NOT NULL DEFAULT 'PROCESSING',
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastError" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendly_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendly_webhook_events_eventKey_key" ON "calendly_webhook_events"("eventKey");

-- CreateIndex
CREATE INDEX "calendly_webhook_events_status_updatedAt_idx" ON "calendly_webhook_events"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "calendly_webhook_events_inviteeUri_idx" ON "calendly_webhook_events"("inviteeUri");
