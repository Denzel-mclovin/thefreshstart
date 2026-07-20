import { prisma } from "../../../prisma/prisma";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const { sessionId, questionId, question, answer, utm = {}, userName, userEmail, userPhone} = body

    if (!questionId || !question || answer === undefined) {

      if (questionId > 5) {
        return
      } 
        throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
        })
    }

    let lead

    try {

    if (!sessionId) {
    const newSessionId = randomUUID()

    lead = await prisma.lead.create({
      data: {
        sessionId: newSessionId,
        lastStep: questionId,
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        utmTerm: utm.utm_term,
        utmContent: utm.utm_content,
      } as any,
    })
  } else {
    lead = await prisma.lead.findUnique({
      where: {
        sessionId,
      },
    })

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          sessionId,
          lastStep: questionId,

          firstName: userName,
          phone: userPhone,
          email: userEmail,

          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          utmTerm: utm.utm_term,
          utmContent: utm.utm_content,
        } as any,
      })
    }
  }

  await prisma.quizAnswer.upsert({
    where: {
      leadId_questionId: {
        leadId: lead.id,
        questionId,
      },
    },

    update: {
      answer,
    },

    create: {
      leadId: lead.id,
      questionId,
      question,
      answer,
    },
  })

  await prisma.lead.update({
    where: {
      id: lead.id,
    },

    data: {
      lastStep: Math.max(
        lead.lastStep,
        questionId
      ),
    },
  })

  return {

    success: true,
    sessionId: lead.sessionId,
    leadId: lead.id,
  }



    } catch (err) {

        console.log("something went wrong while saving quiz answer:")

        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
            statusCode: 500
        }
    }
})