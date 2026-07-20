-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WAITING_CALL', 'PURCHASED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('PHONE_CALL', 'GOOGLE_MEET', 'SOMEWHERE_ELSE');

-- CreateEnum
CREATE TYPE "ChoicedBookCover" AS ENUM ('SOFT_COVER', 'HARD_COVER');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete');

-- CreateEnum
CREATE TYPE "SubscriptionPlanStatus" AS ENUM ('active', 'deactivate');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Callback" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateCallback" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'WAITING_CALL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discountEndAt" TIMESTAMP(3),
    "comment" TEXT,
    "contactMethod" "ContactMethod" NOT NULL DEFAULT 'GOOGLE_MEET',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,

    CONSTRAINT "Callback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallbackReservation" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callbackId" TEXT,

    CONSTRAINT "CallbackReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "sellerId" TEXT,
    "skoolSubscription" BOOLEAN DEFAULT false,
    "skoolUserEmail" TEXT,
    "skoolUserId" TEXT,
    "bookCover" "ChoicedBookCover" NOT NULL DEFAULT 'HARD_COVER',
    "skoolSubDate" TEXT,
    "skoolUserLastName" TEXT,
    "skoolUserName" TEXT,
    "selectedVarId" TEXT,
    "isBookDiscount" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "userId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "subName" TEXT NOT NULL,
    "subDescription" TEXT,
    "subStatus" "SubscriptionPlanStatus" NOT NULL,
    "paymentLink" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "priceId" TEXT NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "userId" TEXT,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeId" TEXT NOT NULL,
    "amountTotal" INTEGER NOT NULL,
    "clientEmail" TEXT NOT NULL,

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "timeSpent" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribution" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedLinks" (
    "id" TEXT NOT NULL,
    "fullUrl" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "utmName" TEXT,
    "visitLink" INTEGER DEFAULT 0,
    "clickBuy" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_skoolUserEmail_key" ON "User"("skoolUserEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeId_key" ON "Subscription"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeId_key" ON "Payment"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_stripeId_key" ON "CheckoutSession"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedLinks_utmSource_utmContent_key" ON "GeneratedLinks"("utmSource", "utmContent");

-- AddForeignKey
ALTER TABLE "CallbackReservation" ADD CONSTRAINT "CallbackReservation_callbackId_fkey" FOREIGN KEY ("callbackId") REFERENCES "Callback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutSession" ADD CONSTRAINT "CheckoutSession_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutSession" ADD CONSTRAINT "CheckoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
