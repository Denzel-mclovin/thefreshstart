import { defineEventHandler, readBody, createError } from "h3";
import { activeCampaign } from "../../utils/activeCampaingClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.title || !body.type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title and type are required",
    });
  }

  return await activeCampaign.post("fields", {
    field: {
      title: body.title,
      type: body.type,
      options: body.options || [],
    },
  });
});