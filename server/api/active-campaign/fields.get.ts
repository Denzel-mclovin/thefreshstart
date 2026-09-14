import { defineEventHandler } from "h3";
import { activeCampaign } from "../../utils/activeCampaingClient";


export default defineEventHandler(async () => {
  return await activeCampaign.get("fields");
});