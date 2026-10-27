import { prisma } from "../../../prisma/prisma";
import { randomUUID } from "crypto";

function mapQ4ToCode(val: string): "A" | "B" | "C" | "D" {
  const norm = val.trim().toLowerCase();
  if (norm === "a" || norm === "yes") return "A";
  if (norm === "b" || norm === "week") return "B";
  if (norm === "c" || norm === "affirm") return "C";
  if (norm === "d" || norm === "no") return "D";
  return "A";
}

function resolveTrafficSource(utmSource?: string, fbclid?: string | null): "PAID" | "EMAIL_LIST" | "ORGANIC" | "OTHER" {
  const src = (utmSource || "").toLowerCase();
  if (fbclid || src === "meta" || src === "facebook" || src === "instagram") return "PAID";
  if (src.includes("email")) return "EMAIL_LIST";
  if (src === "google" || src === "organic") return "ORGANIC";
  return "OTHER";
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    sessionId,
    questionId,
    question,
    answer,
    attribution = {},
    q5FreeText,
  } = body;

  if (!questionId || !question || answer === undefined) {
    if (questionId > 5) return;
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  try {
    let leadSessionId = sessionId;
    if (!leadSessionId) {
      leadSessionId = randomUUID();
    }

    const trafficSource = resolveTrafficSource(attribution.utm_source, attribution.fbclid);

    // Initial lead data with first-touch attribution fallbacks
    const initialAttributionData = {
      utmSource: attribution.utm_source || "direct",
      utmMedium: attribution.utm_medium || "direct",
      utmCampaign: attribution.utm_campaign || "direct",
      utmContent: attribution.utm_content || "direct",
      utmTerm: attribution.utm_term || null,
      fbclid: attribution.fbclid || null,
      fbc: attribution.fbc || null,
      fbp: attribution.fbp || null,
      referrer: attribution.referrer || "direct",
      landingPage: attribution.landing_page || "/",
      trafficSource,
      firstVisitAt: attribution.ts_first_visit ? new Date(attribution.ts_first_visit) : new Date(),
    };

    let lead = await prisma.lead.findUnique({
      where: { sessionId: leadSessionId },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          sessionId: leadSessionId,
          lastStep: questionId,
          ...initialAttributionData,
          status: "NEW",
        },
      });

      // Append initial status history
      await prisma.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          status: "NEW",
          createdBy: "quiz_init",
        },
      });
    }

    // Save individual question answer into QuizAnswer table
    await prisma.quizAnswer.upsert({
      where: {
        leadId_questionId: {
          leadId: lead.id,
          questionId,
        },
      },
      update: {
        answer: String(answer),
      },
      create: {
        leadId: lead.id,
        questionId,
        question,
        answer: String(answer),
      },
    });

    // Prepare fields to update directly on Lead
    const leadUpdates: Record<string, any> = {
      lastStep: Math.max(lead.lastStep, questionId),
    };

    // If attribution wasn't fully set on lead, populate it
    if (!lead.utmSource && initialAttributionData.utmSource) {
      Object.assign(leadUpdates, initialAttributionData);
    }

    if (questionId === 1) {
      if (!lead.quizStartedAt) leadUpdates.quizStartedAt = new Date();
      leadUpdates.q1RemoteStatus = String(answer);
    } else if (questionId === 2) {
      leadUpdates.q2TimeCommitment = String(answer);
    } else if (questionId === 3) {
      leadUpdates.q3Autonomy = String(answer);
    } else if (questionId === 4) {
      // Q4 is ts_lead_created! Price is shown at Q4.
      const code = mapQ4ToCode(String(answer));
      const financingFlag = code === "C";
      const newStatus = code === "D" ? "DISQUALIFIED_QUIZ" : "NEW";

      if (!lead.leadCreatedAt) leadUpdates.leadCreatedAt = new Date();
      leadUpdates.q4FinancialReadiness = code;
      leadUpdates.financingFlag = financingFlag;
      leadUpdates.status = newStatus;

      // Append to status history
      await prisma.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          status: newStatus,
          createdBy: "quiz_q4",
        },
      });
    } else if (questionId === 5) {
      // Q5 is ts_quiz_completed!
      if (!lead.quizCompletedAt) leadUpdates.quizCompletedAt = new Date();
      leadUpdates.q5ConcernCode = String(answer);
      if (q5FreeText) leadUpdates.q5ConcernFreetext = String(q5FreeText);
    }

    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: leadUpdates,
    });

    return {
      success: true,
      sessionId: updatedLead.sessionId,
      leadId: updatedLead.id,
      leadCreatedAt: updatedLead.leadCreatedAt,
      status: updatedLead.status,
    };
  } catch (err: any) {
    console.error("Error saving quiz step:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      statusCode: 500,
    };
  }
});