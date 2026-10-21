import { prisma } from "../../../prisma/prisma";

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
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
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
        timezone: timezone || lead.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        quizComment: quizComment || lead.quizComment,
      };

      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: updateData,
      });
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
