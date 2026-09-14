import { defineEventHandler } from "h3";
import { activeCampaign } from "@/server/utils/activeCampaingClient";

export default defineEventHandler(async () => {
  return await activeCampaign.get("fields");
});