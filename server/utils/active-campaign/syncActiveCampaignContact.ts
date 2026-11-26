

import { activeCampaign } from "../activeCampaingClient";

type BookingStatus = "BOOKED" | "CANCELLED";

type SyncContactParams = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q5FreeText?: string;
  financingFlag?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  referrer?: string;
  landingPage?: string;
  bookingStatus: BookingStatus;
  callScheduledFor: Date | null;
  scheduledACall?: boolean;
  meetJoinLink?: string | null;
  timezone?: string | null;
  rescheduleUrl?: string | null;
  missedACall?: boolean;
};

function formatInTimezone(date: Date, timeZone?: string | null) {
  const tz = timeZone || "UTC";
  const d = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const t = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return { date: d, time: t };
}

export async function syncActiveCampaignContact(p: SyncContactParams) {
  const isCancelled = p.bookingStatus === "CANCELLED";

  const local = p.callScheduledFor
    ? formatInTimezone(p.callScheduledFor, p.timezone)
    : null;

  const raw: { field: string; value: string | undefined }[] = [
    { field: "38", value: p.q1 },
    { field: "39", value: p.q2 },
    { field: "40", value: p.q3 },
    { field: "41", value: p.q4 },
    { field: "42", value: p.q5 },
    { field: "43", value: p.q5FreeText },
    {
      field: "44",
      value: p.financingFlag === undefined ? undefined : String(p.financingFlag),
    },
    { field: "45", value: p.utmSource },
    { field: "46", value: p.utmMedium },
    { field: "47", value: p.utmCampaign },
    { field: "48", value: p.utmContent },
    { field: "49", value: p.fbclid },
    { field: "50", value: p.fbc },
    { field: "51", value: p.fbp },
    { field: "52", value: p.referrer },
    { field: "53", value: p.landingPage },
    {
      field: "54",
      value:
        p.scheduledACall === undefined ? (isCancelled ? "NO" : undefined) : p.scheduledACall ? "YES" : "NO",
    },
    { field: "55", value: local?.date },
    { field: "57", value: local?.time },
    { field: "58", value: p.meetJoinLink ?? undefined },
    { field: "59", value: p.timezone ?? undefined },
    { field: "60", value: p.rescheduleUrl ?? undefined },
    {
      field: "61",
      value:
        p.missedACall === undefined ? undefined : p.missedACall ? "YES" : "NO",
    },
  ];

  const fieldValues = raw
    .filter((f) => f.value !== undefined && f.value !== null && f.value !== "")
    .map((f) => ({ field: f.field, value: String(f.value) }));

  if (isCancelled) {
    for (const id of ["55", "57", "58", "60"]) {
      fieldValues.push({ field: id, value: "" });
    }
  }

  return await activeCampaign.post("contact/sync", {
    contact: {
      email: p.email,
      firstName: p.firstName,
      lastName: p.lastName,
      ...(p.phone ? { phone: p.phone } : {}),
      fieldValues,
    },
  });
}