
import {
  createError,
  defineEventHandler,
  readBody,
} from "h3";

import { prisma } from "../../../prisma/prisma";
import { syncActiveCampaignContact } from "../../../server/utils/active-campaign/syncActiveCampaignContact";


type CalendlyPayload = {
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
    if (isCreated) {
      const scheduledAt = payload.scheduled_event?.start_time
        ? new Date(payload.scheduled_event.start_time)
        : null;

      if (
        scheduledAt &&
        Number.isNaN(scheduledAt.getTime())
      ) {
        throw new Error("Invalid scheduled event date");
      }

      const nameParts = (payload.name ?? "").trim().split(/\s+/);

      const lead = await prisma.lead.upsert({
        where: { email },
        create: {
          email,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          status: "BOOKED",
          bookingMadeAt: new Date(),
          callScheduledFor: scheduledAt,
          calendlyInviteeUri: inviteeUri,
          calendlyEventUri: eventUri ?? null,
        },
        update: {
          status: "BOOKED",
          bookingMadeAt: new Date(),
          callScheduledFor: scheduledAt,
          calendlyInviteeUri: inviteeUri,
          calendlyEventUri: eventUri ?? null,
        },
      });

      await syncActiveCampaignContact({
        email,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        bookingStatus: "BOOKED",
        callScheduledFor: scheduledAt,
        scheduledACall: true,
        meetJoinLink: payload.uri,
        timezone: payload.timezone ?? null,
        rescheduleUrl: payload.reschedule_url ?? null,

      });

      console.log(`Lead synced with ActiveCampaign: ${email}`);

      await syncActiveCampaignContact({
        email,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        bookingStatus: "BOOKED",
        callScheduledFor: scheduledAt,
        scheduledACall: true,
        meetJoinLink: payload.uri,
        timezone: payload.timezone ?? null,
        rescheduleUrl: payload.reschedule_url ?? null,

      });

      console.log(`Lead synced with ActiveCampaign: ${email}`);

      void lead;
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