
// import { activeCampaign } from "../activeCampaingClient";

// type BookingStatus = "BOOKED" | "CANCELLED";

// type SyncActiveCampaignContactParams = {
//   email: string;
//   firstName: string;
//   lastName: string;
//   bookingStatus: BookingStatus;
//   callScheduledFor?: Date | null;
// };

// type ActiveCampaignContact = {
//   id: string;
// };

// type ContactsResponse = {
//   contacts: ActiveCampaignContact[];
// };

// type ContactResponse = {
//   contact: ActiveCampaignContact;
// };

// export async function syncActiveCampaignContact({
//   email,
//   firstName,
//   lastName,
//   bookingStatus,
//   callScheduledFor = null,
// }: SyncActiveCampaignContactParams) {
//   const fieldValues = [
//     {
//       field: "54",
//       value: bookingStatus === "BOOKED" ? "Yes" : "No",
//     },
//     {
//       field: "55",
//       value: callScheduledFor
//         ? callScheduledFor.toISOString().slice(0, 10)
//         : "",
//     },
//     {
//       field: "57",
//       value: callScheduledFor
//         ? callScheduledFor.toISOString().slice(11, 16)
//         : "",
//     },
//   ];

//   const searchResponse =
//     await activeCampaign.get<ContactsResponse>("contacts", {
//       query: { email },
//     }) as ContactsResponse;

//   const existingContact = searchResponse.contacts?.[0];

//   let contactId: string;

//   if (existingContact) {
//     const response =
//       await activeCampaign.put<ContactResponse>(
//         `contacts/${existingContact.id}`,
//         {
//           contact: {
//             email,
//             firstName,
//             lastName,
//             fieldValues,
//           },
//         },
//       ) as ContactResponse;

//     contactId = response.contact.id;
//   } else {
//     const response =
//       await activeCampaign.post<ContactResponse>("contacts", {
//         contact: {
//           email,
//           firstName,
//           lastName,
//           fieldValues,
//         },
//       }) as ContactResponse;

//     contactId = response.contact.id;
//   }

//   return { contactId };
// }


import { activeCampaign } from "../activeCampaingClient";

type BookingStatus = "BOOKED" | "CANCELLED";

type SyncContactParams = {
  email: string;
  firstName: string;
  lastName: string;
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
  bookingStatus,
  callScheduledFor,
  scheduledACall,
  meetJoinLink,
  timezone,
  rescheduleUrl,
}: SyncContactParams) {
  const fieldValues = [
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
