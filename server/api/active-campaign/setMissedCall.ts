// let missedFieldId: string | null = null

// const SCHEDULED_A_CALL_FIELD_ID = "54";
// const MISSED_A_CALL_FIELD_ID = "61";

// async function getMissedFieldId(): Promise<string> {
//   if (missedFieldId) return missedFieldId

//   const res: any = await activeCampaign.get("fields", { query: { limit: 100 } })
//   const field = res?.fields?.find((f: any) => f.perstag === "MISSED_A_CALL")

//   if (!field) throw new Error("ActiveCampaign field MISSED_A_CALL not found")

//   missedFieldId = String(field.id)
//   return missedFieldId
// }

// export async function setMissedCall(email: string, value: boolean) {
//   const field = await getMissedFieldId()

//   const res: any = await activeCampaign.post("contact/sync", {
//     contact: {
//       email,
//       fieldValues: [{ field, value: value ? "YES" : "NO" }],
//     },
//   })

//   return String(res?.contact?.id ?? "")
// }

// export async function setMissedCall(email: string): Promise<string> {

//   const getFields: any = await activeCampaign.get("fields", { query: { limit: 100 } })
//   const fieldMissed = getFields?.fields?.find((f: any) => f.perstag === "MISSED_A_CALL");
//   const fieldSchedule = getFields?.fields?.find((f: any) => f.perstag === "SCHEDULE_A_CALL");



//   console.log(getFields, "fields")




//   // const res: any = await activeCampaign.post("contact/sync", {
//   //   contact: {
//   //     email,
//   //     fieldValues: [
//   //       { fieldMissed, "YES" }
//   //       { fieldSchedule, "NO" },
//   //     ],
//   //   },
//   // });

//   // return String(res?.contact?.id ?? "");
//   return getFields
// }


import { activeCampaign } from "../../utils/activeCampaingClient";

const SCHEDULED_A_CALL_FIELD_ID = "54"; // perstag SCHEDULED_A_CALL
const MISSED_A_CALL_FIELD_ID = "61";    // perstag MISSED_A_CALL

export async function setMissedCall(email: string): Promise<string> {
  const res: any = await activeCampaign.post("contact/sync", {
    contact: {
      email,
      fieldValues: [
        { field: MISSED_A_CALL_FIELD_ID, value: "YES" },
        { field: SCHEDULED_A_CALL_FIELD_ID, value: "NO" },
      ],
    },
  });

  // console.log("setMissedCall fieldValues:", res?.fieldValues);

  return String(res?.contact?.id ?? "");
}