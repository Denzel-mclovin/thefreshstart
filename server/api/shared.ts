import { defineEventHandler } from "#imports";

import { getLocation } from "../services/sharedServices";

export default defineEventHandler((event) => {

    const method = event.node.req.method;
    const query = getQuery(event);

    switch(method) {
        case "GET":

            if (query.method === "get-location") {
                return getLocation(event);
            }



            break;
        case "POST":
            break;
        case "PATCH":
            break;
        case "DELETE":
            break;
    }

})