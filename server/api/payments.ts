import { defineEventHandler } from "#imports";

import { 
    stripeTest,
    GetPaymentLink,
    GetCheckoutSession,
    StripeWebhook,
    GetPaymentList


 } from "../services/paymentServices";



export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    const query = getQuery(event);


    switch(method) {
        case "GET":

            if (query.method === "get-checkout-session") {

                const { session_id } = query;
                return await GetCheckoutSession(session_id as string);
            } else if (query.method === "get-payment-list") {

                return await GetPaymentList();

            } else {

                return await stripeTest();

            }


            break;
        case "POST":

            if (query.method === "get-payment-link") {
                return await GetPaymentLink(event);
            } else {
                return await StripeWebhook(event);

            }

            break;
        case "PATCH":
            break;
        case "DELETE":
            break;
    }
})