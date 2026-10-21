
import {
  createError,
  defineEventHandler,
  readBody,
} from "h3";

import { prisma } from "../../../prisma/prisma";


type CalendlyPayload = {
  email?: string;
  name?: string;
  uri?: string;
  rescheduled?: boolean;
  new_invitee?: string | null;
  scheduled_event?: {
    uri?: string;
    start_time?: string;
  };
};

type CalendlyWebhook = {
  event: "invitee.created" | "invitee.canceled";
  payload: CalendlyPayload;
};

export default defineEventHandler(async (event) => {

  const body = await readBody<CalendlyWebhook>(event);

  const isCreated = body.event === "invitee.created";
  const isCanceled = body.event === "invitee.canceled";

  if (!isCreated && !isCanceled) {
    return { success: true, skipped: true };
  }

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
          firstName: nameParts[0] || "UNDEFINED",
          lastName: nameParts.slice(1).join(" ") || "UNDEFINED",
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

      await prisma.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          status: "BOOKED",
          createdBy: "calendly_webhook",
        },
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

        await prisma.leadStatusHistory.create({
          data: {
            leadId: lead.id,
            status: "CANCELLED",
            createdBy: "calendly_webhook_cancel",
          },
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