import { defineEventHandler } from "#imports";

import { GetSellersList } from "../services/sellerServices";

export default defineEventHandler((event) => {

    const method = event.node.req.method;
    const query = getQuery(event);

    switch(method) {
        case "GET":

            if (query.method === "get-sellers-list") {
                return GetSellersList();
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