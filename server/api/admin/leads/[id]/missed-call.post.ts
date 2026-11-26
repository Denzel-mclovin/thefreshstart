// import { defineEventHandler, getRouterParam, createError } from "h3";
// import { markMissedCall } from "../../../../utils/active-campaign/markMissedCall";

// export default defineEventHandler(async (event) => {
//   const id = getRouterParam(event, "id");

//   if (!id) {
//     throw createError({ statusCode: 400, statusMessage: "Lead id is required" });
//   }

//   return markMissedCall({ id });
// });

import { defineEventHandler, getRouterParam, createError } from "h3";
import { markMissedCall } from "../../../../utils/active-campaign/markMissedCall";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Lead id is required" });
  }

  return markMissedCall({ id });
});