// SYNC ACTIVE CAMPAIGN CONTACT

import { activeCampaign } from "../activeCampaingClient";

type BookingStatus = "BOOKED" | "CANCELLED";

type SyncContactParams = {
  email: string;
  firstName: string;
  lastName: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q5FreeText?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbc?: string;
  fbp?: string;
  bookingStatus: BookingStatus;
  callScheduledFor: Date | null;
  scheduledACall?: boolean;
  meetJoinLink?: string | null;
  timezone?: string | null;
  rescheduleUrl?: string | null;
};

export async function syncActiveCampaignContact({
  email,
  firstName,
  lastName,
  q1,
  q2,
  q3,
  q4,
  q5,
  q5FreeText,
  utmSource,
  utmMedium,
  utmCampaign,
  utmContent,
  fbc,
  fbp,
  bookingStatus,
  callScheduledFor,
  scheduledACall,
  meetJoinLink,
  timezone,
  rescheduleUrl,
}: SyncContactParams) {
  const fieldValues = [
    {
      field: "38",
      value: q1 ?? "",
    },
    {
      field: "39",
      value: q2 ?? "",
    },
    {
      field: "40",
      value: q3 ?? "",
    },
    {
      field: "41",
      value: q4 ?? "",
    },
    {
      field: "42",
      value: q5 ?? "",
    },
    {
      field: "43",
      value: q5FreeText ?? "",
    },
    {
      field: "44",
      value: utmSource ?? "",
    },
    {
      field: "45",
      value: utmMedium ?? "",
    },
    {
      field: "46",
      value: utmCampaign ?? "",
    },
    {
      field: "47",
      value: utmContent ?? "",
    },
    {
      field: "48",
      value: fbc ?? "",
    },
    {
      field: "50",
      value: fbp ?? "",
    },
    {
      field: "54",
      value: scheduledACall ? "YES" : "NO",
    },
    {
      field: "55",
      value: callScheduledFor
        ? callScheduledFor.toISOString().slice(0, 10)
        : "",
    },
    {
      field: "57",
      value: callScheduledFor
        ? callScheduledFor.toISOString().slice(11, 16)
        : "",
    },
    {
      field: "58",
      value: meetJoinLink ?? "",
    },
    {
      field: "59",
      value: timezone ?? "",
    },
    {
      field: "60",
      value: rescheduleUrl ?? "",
    },
  ];

  return await activeCampaign.post("contact/sync", {
    contact: {
      email,
      firstName,
      lastName,
      fieldValues,
    },
  });
}
