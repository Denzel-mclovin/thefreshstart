
// webhook calendly
import {
  createError,
  defineEventHandler,
  readBody,
} from "h3";

import { prisma } from "../../../prisma/prisma";
import { syncActiveCampaignContact } from "../../../server/utils/active-campaign/syncActiveCampaignContact";


type CalendlyPayload = {
  tracking?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  questions_and_answers?: {
    question: string;
    answer: string;
  }[];
  email?: string;
  name?: string;
  first_name?: string | null;
  last_name?: string | null;

  uri?: string;
  event?: string;
  timezone?: string;
  reschedule_url?: string | null;
  cancel_url?: string | null;

  rescheduled?: boolean;
  new_invitee?: string | null;

  scheduled_event?: {
    uri?: string;
    start_time?: string;
    end_time?: string;
  };
};




type CalendlyWebhook = {
  event: "invitee.created" | "invitee.canceled";
  payload: CalendlyPayload;
};

export default defineEventHandler(async (event) => {


  const TEST_MODE = false;

  const body = await readBody<CalendlyWebhook>(event);

  console.log(body, "Calendly Webhook Received");

  const isCreated = body.event === "invitee.created";
  const isCanceled = body.event === "invitee.canceled";

  if (!isCreated && !isCanceled) {
    return { success: true, skipped: true };
  }

  // if (TEST_MODE) {
  //   return { success: true, skipped: true };
  // }

  const payload = body.payload;
  const email = payload.email?.trim().toLowerCase();
  const inviteeUri = payload.uri;
  const eventUri = payload.scheduled_event?.uri;

  if (!inviteeUri || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing invitee URI or email",
    });
  }

  const eventType = isCreated
    ? "INVITEE_CREATED"
    : "INVITEE_CANCELED";

  const eventKey = `${eventType}:${inviteeUri}`;

  let webhookEvent;

  try {
    webhookEvent = await prisma.calendlyWebhookEvent.create({
      data: {
        eventKey,
        eventType,
        inviteeUri,
        scheduledEventUri: eventUri,
        payload: body as any,
        status: "PROCESSING",
      },
    });
  } catch (error: any) {
    if (error?.code !== "P2002") {
      throw error;
    }

    const existing =
      await prisma.calendlyWebhookEvent.findUnique({
        where: { eventKey },
      });

    if (!existing) {
      throw error;
    }

    if (existing.status === "SUCCESS") {
      return {
        success: true,
        duplicate: true,
      };
    }

    if (existing.status === "PROCESSING") {
      return {
        success: true,
        processing: true,
      };
    }

    webhookEvent =
      await prisma.calendlyWebhookEvent.update({
        where: { eventKey },
        data: {
          status: "PROCESSING",
          attempts: { increment: 1 },
          lastError: null,
        },
      });
  }

  try {
    // if (isCreated) {
    //   const scheduledAt = payload.scheduled_event?.start_time
    //     ? new Date(payload.scheduled_event.start_time)
    //     : null;

    //   if (
    //     scheduledAt &&
    //     Number.isNaN(scheduledAt.getTime())
    //   ) {
    //     throw new Error("Invalid scheduled event date");
    //   }

    //   const nameParts = (payload.name ?? "").trim().split(/\s+/);

    //   const lead = await prisma.lead.upsert({
    //     where: { email },
    //     create: {
    //       email,
    //       firstName: nameParts[0] || "",
    //       lastName: nameParts.slice(1).join(" ") || "",
    //       status: "BOOKED",
    //       bookingMadeAt: new Date(),
    //       callScheduledFor: scheduledAt,
    //       calendlyInviteeUri: inviteeUri,
    //       calendlyEventUri: eventUri ?? null,
    //     },
    //     update: {
    //       status: "BOOKED",
    //       bookingMadeAt: new Date(),
    //       callScheduledFor: scheduledAt,
    //       calendlyInviteeUri: inviteeUri,
    //       calendlyEventUri: eventUri ?? null,
    //     },
    //   });

    //   await syncActiveCampaignContact({
    //     email,
    //     firstName: nameParts[0] || "",
    //     lastName: nameParts.slice(1).join(" ") || "",
    //     bookingStatus: "BOOKED",
    //     callScheduledFor: scheduledAt,
    //     scheduledACall: true,
    //     meetJoinLink: payload.uri,
    //     timezone: payload.timezone ?? null,
    //     rescheduleUrl: payload.reschedule_url ?? null,

    //   });

    //   console.log(`Lead synced with ActiveCampaign: ${email}`);

    //   // await syncActiveCampaignContact({
    //   //   email,
    //   //   firstName: nameParts[0] || "",
    //   //   lastName: nameParts.slice(1).join(" ") || "",
    //   //   bookingStatus: "BOOKED",
    //   //   callScheduledFor: scheduledAt,
    //   //   scheduledACall: true,
    //   //   meetJoinLink: payload.uri,
    //   //   timezone: payload.timezone ?? null,
    //   //   rescheduleUrl: payload.reschedule_url ?? null,

    //   // });

    //   // console.log(`Lead synced with ActiveCampaign: ${email}`);

    //   void lead;
    // }


    if (isCreated) {
      const tracking = payload.tracking ?? {};
      const sessionId: string | null = tracking.utm_term || null;
      const qa = payload.questions_and_answers ?? [];

      const scheduledAt = payload.scheduled_event?.start_time
        ? new Date(payload.scheduled_event.start_time) : null;

      const nameParts = (payload.name ?? "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const [bySession, byEmail] = await Promise.all([
        sessionId ? prisma.lead.findUnique({ where: { sessionId } }) : null,
        prisma.lead.findUnique({ where: { email } }),
      ]);
      const existing = bySession ?? byEmail;

      const bookingData = {
        status: "BOOKED" as const,
        bookingMadeAt: new Date(),
        callScheduledFor: scheduledAt,
        calendlyInviteeUri: inviteeUri,
        calendlyEventUri: eventUri ?? null,
        timezone: payload.timezone ?? undefined,
      };

      const isEmpty = (v?: string | null) => !v || v === "UNDEFINED";

      const phoneFromCalendly =
        qa.find(i => /phone/i.test(i.question))?.answer ||
        (payload as any).text_reminder_number || undefined;

      const lead = existing
        ? await prisma.lead.update({
            where: { id: existing.id },
            data: {
              ...bookingData,
              firstName: isEmpty(existing.firstName) ? firstName : existing.firstName,
              lastName:  isEmpty(existing.lastName)  ? lastName  : existing.lastName,
              ...(isEmpty(existing.phone) && phoneFromCalendly ? { phone: phoneFromCalendly } : {}),
              ...(!existing.email && !(byEmail && byEmail.id !== existing.id)
                ? { email } : {}),
            },
          })
        : await prisma.lead.create({
            data: { email, firstName, lastName, sessionId, ...bookingData },
          });

      const quizAnswers = sessionId
        ? await prisma.quizAnswer.findMany({ where: { lead: { sessionId } } })
        : [];
      const ans = (id: number) => quizAnswers.find(x => x.questionId === id)?.answer;

      await syncActiveCampaignContact({
        email,
        firstName,
        lastName,

        // !!!!!
        q1: ans(1), 
        q2: ans(2), 
        q3: ans(3), 
        q4: ans(4), 
        q5: ans(5),
        q5FreeText: lead.quizComment ?? qa.find(i => /homerun|90/i.test(i.question))?.answer,
        // financingFlag: ans(4) === "affirm",
        utmSource: tracking.utm_source,
        utmMedium: tracking.utm_medium,
        utmCampaign: tracking.utm_campaign,
        utmContent: tracking.utm_content,
        fbc: lead.fbc ?? undefined,
        fbp: lead.fbp ?? undefined,
        bookingStatus: "BOOKED",
        callScheduledFor: scheduledAt,
        scheduledACall: true,
        timezone: payload.timezone ?? null,
        rescheduleUrl: payload.reschedule_url ?? null,
      });
    }


    if (isCanceled) {
      const lead = await prisma.lead.findUnique({
        where: { email },
      });

      const isRescheduled =
        payload.rescheduled === true ||
        Boolean(payload.new_invitee);

      const isCurrentBooking =
        lead?.calendlyInviteeUri === inviteeUri;

      if (lead && isCurrentBooking && !isRescheduled) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            status: "CANCELLED",
            calendlyInviteeUri: null,
            calendlyEventUri: null,
            callScheduledFor: null,
          },
        });

        await syncActiveCampaignContact({
          email,
          firstName: lead.firstName,
          lastName: lead.lastName,
          bookingStatus: "CANCELLED",
          callScheduledFor: null,
          timezone: payload.timezone ?? undefined,
        });

      }
    }

    await prisma.calendlyWebhookEvent.update({
      where: { eventKey },
      data: {
        status: "SUCCESS",
        processedAt: new Date(),
        lastError: null,
      },
    });

    return { success: true };
  } catch (error: any) {
    await prisma.calendlyWebhookEvent.update({
      where: { eventKey },
      data: {
        status: "FAILED",
        lastError: String(error?.message ?? error).slice(0, 2000),
      },
    });

    throw createError({
      statusCode: 500,
      statusMessage: "Calendly webhook processing failed",
    });
  }
});