import { readBody, createError } from "h3";
import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { inviteeUri, eventUri, sessionId } = body;

  if (!inviteeUri) {
    throw createError({
      statusCode: 400,
      statusMessage: "inviteeUri is required",
    });
  }

  const token = process.env.CALENDLY_TOKEN;

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "Calendly token is missing",
    });
  }

  try {
    const invitee = await $fetch<any>(inviteeUri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!invitee) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch Calendly invitee",
      });
    }

    const name = (invitee.resource.name || "").trim();
    const parts = name.split(/\s+/);
    const receivedName = parts.shift() || "";
    const receivedLastName = parts.join(" ");
    const inviteeEmail = invitee.resource.email;
    const inviteeTimezone = invitee.resource.timezone || null;

    // Fetch scheduled event time if eventUri is provided
    let scheduledStartTime: Date | null = null;
    if (eventUri) {
      try {
        const scheduledEvent = await $fetch<any>(eventUri, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (scheduledEvent?.resource?.start_time) {
          scheduledStartTime = new Date(scheduledEvent.resource.start_time);
        }
      } catch (e) {
        console.warn("Could not fetch scheduled event start time:", e);
      }
    }

    const now = new Date();

    const existingLead = await prisma.lead.findFirst({
      where: sessionId ? { sessionId } : { email: inviteeEmail },
    });

    if (existingLead) {
      const updatedLead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          firstName: receivedName || existingLead.firstName,
          lastName: receivedLastName || existingLead.lastName,
          email: inviteeEmail || existingLead.email,
          timezone: inviteeTimezone || existingLead.timezone,
          status: "BOOKED",
          bookingMadeAt: now, // ts_booking_made
          callScheduledFor: scheduledStartTime || existingLead.callScheduledFor, // ts_call_scheduled_for
          calendlyInviteeUri: inviteeUri,
          calendlyEventUri: eventUri ?? null,
        },
      });

      // Append-only history record
      await prisma.leadStatusHistory.create({
        data: {
          leadId: updatedLead.id,
          status: "BOOKED",
          createdBy: "calendly_invite",
        },
      });

      // Dispatch CAPI Schedule event directly from server
      const host = getRequestHeader(event, "host") || "thefreshstart.com";
      const protocol = host.includes("localhost") ? "http" : "https";
      try {
        await $fetch(`${protocol}://${host}/api/meta/capi`, {
          method: "POST",
          body: {
            eventName: "Schedule",
            eventId: `sched_${updatedLead.id}_${now.getTime()}`,
            eventSourceUrl: `${protocol}://${host}/confirmation`,
            fbc: updatedLead.fbc,
            fbp: updatedLead.fbp,
            email: updatedLead.email,
            phone: updatedLead.phone,
            firstName: updatedLead.firstName,
            lastName: updatedLead.lastName,
            customData: {
              content_name: "Calendly Call Scheduled",
              q5_concern_code: updatedLead.q5ConcernCode,
            },
          },
        });
      } catch (capiErr) {
        console.warn("[Calendly CAPI Schedule error]", capiErr);
      }
    }

    return {
      success: true,
      invitee,
    };
  } catch (error: any) {
    console.error("Calendly invite processing error:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || "Failed to fetch Calendly invitee",
    });
  }
});