import { defineEventHandler, createError, readBody } from "h3";
import { activeCampaign } from "../../../utils/activeCampaingClient";

export default defineEventHandler(async (event) => {
//   const id = event.context.params?.id;

  const { id } = await readBody(event);


  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Field ID is required",
    });
  }

  return await activeCampaign.delete(`fields/${id}`);
});