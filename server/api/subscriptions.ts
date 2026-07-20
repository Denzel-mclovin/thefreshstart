import { defineEventHandler } from "#imports";


import { 
    GetSubscriptionsList 
} from "../services/subscriptionServices";


export default defineEventHandler( async (event) => {


    const method = event.node.req.method;
    const query = getQuery(event);




    switch(method) {
        case "GET":

            if (query.method === 'get-subscriptions-list') {
                return await GetSubscriptionsList();
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