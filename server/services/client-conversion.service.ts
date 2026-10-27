import { prisma } from "../../prisma/prisma";

export interface CloseWonParams {
  leadId: string;
  contractValue?: number; // defaults to 3000 (dollars)
  cashCollected?: number; // dollars
  paymentMethod?: "FULL_PAY" | "AFFIRM";
  paymentStatus?: "PAID_IN_FULL" | "ON_PLAN" | "LATE" | "REFUNDED";
  assignedConsultant?: string;
  clientGoal?: string;
  clientKpi?: string;
  closedBy?: string; // closer name
  hostUrl?: string;
}

export async function closeLeadAndCreateClient(params: CloseWonParams) {
  const {
    leadId,
    contractValue = 3000,
    cashCollected = 3000,
    paymentMethod = "FULL_PAY",
    paymentStatus = "PAID_IN_FULL",
    assignedConsultant,
    clientGoal,
    clientKpi,
    closedBy = "closer",
    hostUrl = "https://thefreshstart.com",
  } = params;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { client: true },
  });

  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  const now = new Date();
  const outstandingBalance = Math.max(0, contractValue - cashCollected);

  // 1. Update Lead to CLOSED_WON and record closedAt timestamp
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "CLOSED_WON",
      closedAt: now, // ts_closed
    },
  });

  // Append to append-only LeadStatusHistory
  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead.id,
      status: "CLOSED_WON",
      createdBy: closedBy,
      createdAt: now,
    },
  });

  // 2. Create or Update Client - COPYING ALL ATTRIBUTION FIELDS IMMUTABLY
  const clientData = {
    leadId: lead.id,

    // Contact fields copied from Lead
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    timezone: lead.timezone,

    // ALL attribution fields strictly copied across from Lead
    utmSource: lead.utmSource || "direct",
    utmMedium: lead.utmMedium || "direct",
    utmCampaign: lead.utmCampaign || "direct",
    utmContent: lead.utmContent || "direct",
    utmTerm: lead.utmTerm,
    fbclid: lead.fbclid,
    fbc: lead.fbc,
    fbp: lead.fbp,
    referrer: lead.referrer || "direct",
    landingPage: lead.landingPage || "/",

    // Acquisition source
    acquisitionSource: lead.utmSource || "direct",

    // Quiz financing flag
    financingFlag: lead.financingFlag,

    // Money fields (convert dollars to cents or store as integers)
    contractValue,
    cashCollected,
    outstandingBalance,
    paymentMethod,
    paymentStatus,

    // Delivery fields
    startDate: now,
    assignedConsultant: assignedConsultant || null,
    clientGoal: clientGoal || null,
    clientKpi: clientKpi || null,

    // Status
    status: "ONBOARDING" as const,
  };

  const client = await prisma.client.upsert({
    where: { leadId: lead.id },
    create: clientData,
    update: clientData,
  });

  // 3. Append to append-only ClientStatusHistory
  await prisma.clientStatusHistory.create({
    data: {
      clientId: client.id,
      status: "ONBOARDING",
      createdBy: closedBy,
      createdAt: now,
      note: "Converted from lead closed_won",
    },
  });

  // 4. Dispatch offline Purchase event to Meta via CAPI ONLY
  try {
    const datasetId = process.env.META_DATASET_ID || "1541485453520508";
    const token = process.env.META_CAPI_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
    const graphVersion = process.env.META_GRAPH_VERSION || "v26.0";

    if (token) {
      const crypto = await import("node:crypto");
      const hashSha256 = (val?: string | null) =>
        val ? crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex") : undefined;

      const digitsOnly = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";

      const capiPayload = {
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(now.getTime() / 1000),
            event_id: `purchase_${lead.id}_${now.getTime()}`,
            event_source_url: `${hostUrl}/admin/leads`,
            action_source: "system_generated",
            user_data: {
              fbc: lead.fbc || undefined,
              fbp: lead.fbp || undefined,
              em: lead.email ? [hashSha256(lead.email)] : undefined,
              ph: digitsOnly ? [hashSha256(digitsOnly)] : undefined,
              fn: lead.firstName ? [hashSha256(lead.firstName)] : undefined,
              ln: lead.lastName ? [hashSha256(lead.lastName)] : undefined,
            },
            custom_data: {
              value: contractValue,
              currency: "USD",
              content_name: "Fresh Start 90-Day Offer",
            },
          },
        ],
      };

      if (process.env.META_TEST_EVENT_CODE) {
        (capiPayload as any).test_event_code = process.env.META_TEST_EVENT_CODE;
      }

      await $fetch(`https://graph.facebook.com/${graphVersion}/${datasetId}/events?access_token=${token}`, {
        method: "POST",
        body: capiPayload,
      });
    }
  } catch (metaErr) {
    console.error("[CAPI Offline Purchase Error]", metaErr);
  }

  return { success: true, lead, client };
}
