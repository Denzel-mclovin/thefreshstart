// import { prisma } from "../../../prisma/prisma";
// import { createOrUpdateContact } from "../../utils/active-campaign/contacts";

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);
//   // const {
//   //   phoneNumber,
//   //   userEmail,
//   //   firstName,
//   //   lastName,
//   //   quizComment,
//   //   sessionId,
//   //   timezone,
//   // } = body;

//   const {
//     phoneNumber, userEmail, firstName, lastName,
//     quizComment, sessionId, timezone,
//     ac = {},
//   } = body;

//   // const { ac = {}, consentEmail, consentSms } = body;

//   if (!sessionId) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: "sessionId is required",
//     });
//   }

//   try {
//     let lead = await prisma.lead.findUnique({
//       where: { sessionId },
//     });

//     if (!lead) {
//       lead = await prisma.lead.create({
//         data: {
//           sessionId,
//           firstName: firstName || "UNDEFINED",
//           lastName: lastName || "UNDEFINED",
//           phone: phoneNumber || "UNDEFINED",
//           email: userEmail || null,
//           timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
//           quizComment: quizComment || "UNDEFINED",
//           status: "NEW",
//         },
//       });

//       await prisma.leadStatusHistory.create({
//         data: {
//           leadId: lead.id,
//           status: "NEW",
//           createdBy: "contact_submit",
//         },
//       });
//     } else {
//       const updateData: Record<string, any> = {
//         firstName: firstName || lead.firstName,
//         lastName: lastName || lead.lastName,
//         phone: phoneNumber || lead.phone,
//         email: userEmail || lead.email,
//         timezone: timezone || lead.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
//         quizComment: quizComment || lead.quizComment,
//       };

//       lead = await prisma.lead.update({
//         where: { id: lead.id },
//         data: updateData,
//       });
//     }

//     return {
//       statusCode: 200,
//       message: "Lead contact updated successfully",
//       lead,
//     };
//   } catch (err: any) {
//     console.error("Lead update failed:", err);
//     throw createError({
//       statusCode: 500,
//       statusMessage: `Failed to update lead contact: ${err?.message || err}`,
//     });
//   }
// });


import { prisma } from "../../../prisma/prisma";
import { syncContactWithDefaults } from "../../utils/active-campaign/contacts";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    phoneNumber,
    userEmail,
    firstName,
    lastName,
    quizComment,
    sessionId,
    timezone,
    ac = {},
  } = body;

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "sessionId is required",
    });
  }

  try {
    let lead = await prisma.lead.findUnique({
      where: { sessionId },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          sessionId,
          firstName: firstName || "UNDEFINED",
          lastName: lastName || "UNDEFINED",
          phone: phoneNumber || "UNDEFINED",
          email: userEmail || null,
          timezone:
            timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "UTC",
          quizComment: quizComment || "UNDEFINED",
          status: "NEW",
        },
      });

      await prisma.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          status: "NEW",
          createdBy: "contact_submit",
        },
      });
    } else {
      const updateData: Record<string, any> = {
        firstName: firstName || lead.firstName,
        lastName: lastName || lead.lastName,
        phone: phoneNumber || lead.phone,
        email: userEmail || lead.email,
        timezone:
          timezone ||
          lead.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          "UTC",
        quizComment: quizComment || lead.quizComment,
      };

      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: updateData,
      });
    }

    // ─── ActiveCampaign ────────────────────────────────────────────────
    // if (lead.email) {
    //   try {
    //     const { scheduledACall, ...acFields } = ac;

    //     await createOrUpdateContact({
    //       ...acFields,
    //       email: lead.email,
    //       firstName: firstName || undefined,
    //       lastName: lastName || undefined,
    //       phone: phoneNumber || undefined,
    //       q5FreeText: quizComment || undefined,
    //       ...(lead.status === "NEW" ? { scheduledACall: "NO" } : {}),
    //     });
    //   } catch (acErr: any) {
    //     console.error("ActiveCampaign sync failed:", acErr?.message || acErr);
    //   }
    // }

    if (lead.email) {
      try {
        const { scheduledACall, ...acFields } = ac;

        await syncContactWithDefaults({
          ...acFields,
          email: lead.email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: phoneNumber || undefined,
          q5FreeText: quizComment || undefined,
        });
      } catch (acErr: any) {
        console.error("ActiveCampaign sync failed:", acErr?.message || acErr);
      }
    }

    return {
      statusCode: 200,
      message: "Lead contact updated successfully",
      lead,
    };
  } catch (err: any) {
    console.error("Lead update failed:", err);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update lead contact: ${err?.message || err}`,
    });
  }
});