import { defineEventHandler } from "h3";
import { activeCampaign } from "../../utils/activeCampaingClient";


export default defineEventHandler(async () => {
  // return await activeCampaign.get("fields");

   const response = await activeCampaign.get("fields") as any;

  return response.fields.map((field: any) => ({
    id: field.id,
    title: field.title,
    perstag: field.perstag,
    type: field.type,
  }));
});