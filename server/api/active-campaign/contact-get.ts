import { defineEventHandler, getQuery } from "h3";
import { activeCampaign } from "../../utils/activeCampaingClient";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  return await activeCampaign.get("contacts", {
    query: {
      email: query.email,
    },
  });
});