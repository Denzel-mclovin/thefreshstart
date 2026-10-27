-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "TrafficSource" AS ENUM ('PAID', 'ORGANIC', 'EMAIL_LIST', 'OTHER');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "metaAdId" TEXT,
ADD COLUMN     "metaAdsetId" TEXT,
ADD COLUMN     "metaCampaignId" TEXT,
ADD COLUMN     "trafficSource" "TrafficSource" NOT NULL DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "ad_insights" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "adsetId" TEXT NOT NULL,
    "adsetName" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adName" TEXT NOT NULL,
    "spend" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_sync_logs" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "rangeStart" TIMESTAMP(3) NOT NULL,
    "rangeEnd" TIMESTAMP(3) NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'RUNNING',
    "recordsSynced" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,

    CONSTRAINT "meta_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ad_insights_campaignId_idx" ON "ad_insights"("campaignId");

-- CreateIndex
CREATE INDEX "ad_insights_adsetId_idx" ON "ad_insights"("adsetId");

-- CreateIndex
CREATE INDEX "ad_insights_adId_idx" ON "ad_insights"("adId");

-- CreateIndex
CREATE INDEX "ad_insights_date_idx" ON "ad_insights"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ad_insights_date_adId_key" ON "ad_insights"("date", "adId");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "clients"("status");

-- CreateIndex
CREATE INDEX "clients_refundDate_idx" ON "clients"("refundDate");

-- CreateIndex
CREATE INDEX "leads_trafficSource_idx" ON "leads"("trafficSource");

-- CreateIndex
CREATE INDEX "leads_leadCreatedAt_idx" ON "leads"("leadCreatedAt");

-- CreateIndex
CREATE INDEX "leads_closedAt_idx" ON "leads"("closedAt");

-- CreateIndex
CREATE INDEX "leads_metaCampaignId_idx" ON "leads"("metaCampaignId");

-- CreateIndex
CREATE INDEX "leads_metaAdId_idx" ON "leads"("metaAdId");
