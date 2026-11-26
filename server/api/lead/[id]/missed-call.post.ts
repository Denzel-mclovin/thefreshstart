// import { prisma } from "../../../../prisma/prisma";
// import { setMissedCall } from "../../active-campaign/setMissedCall";

// // // export default defineEventHandler(async (event) => {
// // //   // const seller = await requireSeller(event)
// // //   const id = getRouterParam(event, "id")
// // //   if (!id) throw createError({ statusCode: 400, statusMessage: "Lead id is required" })

// // //   const lead = await prisma.lead.findFirst({
// // //     where: { id /*, sellerId: seller.id */ },
// // //   })
// // //   if (!lead) throw createError({ statusCode: 404, statusMessage: "Lead not found" })

// // //   if (!lead.email) throw createError({ statusCode: 400, statusMessage: "Lead has no email" })
// // //   if (!lead.callScheduledFor) throw createError({ statusCode: 400, statusMessage: "Call was not scheduled" })
// // //   if (lead.callScheduledFor > new Date()) throw createError({ statusCode: 400, statusMessage: "Call has not happened yet" })
// // //   if (lead.status === "NO_SHOW") throw createError({ statusCode: 409, statusMessage: "Already marked as missed" })

// // //   let contactId: string
// // //   try {
// // //     contactId = await setMissedCall(lead.email.trim().toLowerCase(), true)
// // //   } catch (e) {
// // //     console.error("setMissedCall failed:", e)
// // //     throw createError({ statusCode: 502, statusMessage: "ActiveCampaign request failed" })
// // //   }

// // //   return prisma.$transaction(async (tx) => {
// // //     await tx.leadStatusHistory.create({
// // //       data: { leadId: id, status: "NO_SHOW" },
// // //     })
// // //     return tx.lead.update({
// // //       where: { id },
// // //       data: {
// // //         status: "NO_SHOW",
// // //         callOutcomeAt: new Date(),
// // //         ...(contactId ? { activeCampaignContactId: contactId } : {}),
// // //       },
// // //       include: { answers: true },
// // //     })
// // //   })
// // // })

// export default defineEventHandler(async (event) => {
//   // const seller = await requireSeller(event)
//   const id = getRouterParam(event, "id")
//   if (!id) throw createError({ statusCode: 400, statusMessage: "Lead id is required" })

//   const lead = await prisma.lead.findFirst({
//     where: { id /*, sellerId: seller.id */ },
//   })
//   if (!lead) throw createError({ statusCode: 404, statusMessage: "Lead not found" })
//   if (!lead.email) throw createError({ statusCode: 400, statusMessage: "Lead has no email" })

//   // TEST: проверки отключены, вернуть после теста
//   // if (!lead.callScheduledFor) throw createError({ statusCode: 400, statusMessage: "Call was not scheduled" })
//   // if (lead.callScheduledFor > new Date()) throw createError({ statusCode: 400, statusMessage: "Call has not happened yet" })
//   // if (lead.status === "NO_SHOW") throw createError({ statusCode: 409, statusMessage: "Already marked as missed" })

//   // TEST: переключаем на противоположное. В бою здесь всегда true
//   const markMissed = lead.status !== "NO_SHOW"

//   let contactId: string
//   try {
//     contactId = await setMissedCall(lead.email.trim().toLowerCase(), markMissed)
//   } catch (e) {
//     console.error("setMissedCall failed:", e)
//     throw createError({ statusCode: 502, statusMessage: "ActiveCampaign request failed" })
//   }

//   return prisma.lead.update({
//     where: { id },
//     data: {
//       status: markMissed ? "NO_SHOW" : "BOOKED",
//       callOutcomeAt: markMissed ? new Date() : null,
//       ...(contactId ? { activeCampaignContactId: contactId } : {}),
//     },
//     include: { answers: true },
//   })
// })

import { defineEventHandler, getRouterParam, createError } from "h3";
import { markMissedCall } from "../../../utils/active-campaign/markMissedCall";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Lead id is required" });
  }

  return markMissedCall({ id });
});