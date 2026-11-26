import { createError } from "h3";
import { prisma } from "../../../prisma/prisma";
import { setMissedCall } from "../../api/active-campaign/setMissedCall";

export async function markMissedCall(where: { id: string; sellerId?: string }) {
  const lead = await prisma.lead.findFirst({ where });

  if (!lead) {
    throw createError({ statusCode: 404, statusMessage: "Lead not found" });
  }
  if (!lead.email) {
    throw createError({ statusCode: 400, statusMessage: "Lead has no email" });
  }
  // if (!lead.callScheduledFor) {
  //   throw createError({ statusCode: 400, statusMessage: "Call was not scheduled" });
  // }
  // if (lead.callScheduledFor > new Date()) {
  //   throw createError({ statusCode: 400, statusMessage: "Call has not happened yet" });
  // }
  // if (lead.status === "NO_SHOW") {
  //   throw createError({ statusCode: 409, statusMessage: "Already marked as missed" });
  // }

  let contactId = "";
  try {
    contactId = await setMissedCall(lead.email.trim().toLowerCase());
  } catch (e) {
    console.error("setMissedCall failed:", e);
    throw createError({ statusCode: 502, statusMessage: "ActiveCampaign request failed" });
  }

  return prisma.$transaction(async (tx) => {
    await tx.leadStatusHistory.create({
      data: { leadId: lead.id, status: "NO_SHOW" },
    });

    return tx.lead.update({
      where: { id: lead.id },
      data: {
        status: "NO_SHOW",
        callOutcomeAt: new Date(),
        ...(contactId ? { activeCampaignContactId: contactId } : {}),
      },
      include: { answers: true, seller: true },
    });
  });
}