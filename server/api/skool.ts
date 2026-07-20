import { defineEventHandler } from "#imports";
import { getQuery, readBody } from "h3";

import {
    webhookHandler,
    getShopifyProducts,
    testDiscountLink,
    reserveDiscountBook
} from "../services/skoolServices"


export default defineEventHandler( async (event) => {

    const method = event.node.req.method;
    const query = getQuery(event);

    const body = await readBody(event);

    console.log('body', body);



    switch(method) {
        case "GET":

            if (query.method === "test-discount-link") {
                return await testDiscountLink();
            }

        return await getShopifyProducts()
            break;
        case "POST":
            // console.log('testing zappier webhook', event.node.req);
            return await webhookHandler(event);
            break;
        case "PATCH":

            if (query.method === "reserve-discount-book") {

                // console.log(body.userEmail, body.subscriptionEmail, body.variantId, 'read body');

                return await reserveDiscountBook(
                    { 
                        userEmail: body.userEmail as string,
                        subscriptionEmail: body.userEmail as string,
                        userName: body.userName as string,
                        bookId: body.variantId as string
                        // reservationId: body.reservationId
                    }
                );
            }
            break;
        case "DELETE":
            break;
    }



})