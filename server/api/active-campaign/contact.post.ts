import { defineEventHandler, readBody } from "h3";
import { activeCampaign } from "~/server/utils/activeCampaingClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await activeCampaign.post("contacts", {
    contact: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,

      fieldValues: body.fieldValues || [],
      tags: body.tags || [],
    },
  });

  return response;
});