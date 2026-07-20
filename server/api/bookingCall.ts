import { defineEventHandler } from "#imports";

import {
    addCallback,
    getAvailableSlots,
    getAllCallbacks,
    reserveSlot,
    discountStatusUpdate
} from "../services/callbackServices";




export default defineEventHandler(async (event) => {

    const method = event.node.req.method;
    const query = getQuery(event);

    const offset = query.offset;


    switch(method) {
        case "GET":

            if (query.method === "getAvailableSlots") {
                return await getAvailableSlots(query.date);
            } else if (query.method === "getAllCallbacks") {
                return await getAllCallbacks();
            }

        break;
        case "POST":

            if(query.method === "addCallback") {
                return await addCallback(event);
            } else if (query.method === "reserveSlot") {
                return await reserveSlot(query.date as string, query.time as string);
            }

        break;
        case "PUT":
        break;
        case "PATCH":
            return await discountStatusUpdate(event);
        break;
        case "DELETE":
        break;
    }

})