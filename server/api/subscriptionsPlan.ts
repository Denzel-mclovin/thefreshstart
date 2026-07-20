import { defineEventHandler } from "#imports";

import {
    addSubscriptionPlan,
    deleteSubscriptionPlan,
    getSubscriptionPlans,
    updateSubscriptionPlan
} from '../services/subscriptionPlanServices';

import { UpdatePlanData } from "~/types/subscriptionPlan";



export default defineEventHandler(async (event) => {

    const method = event.node.req.method;
    const query = getQuery(event);

    const offset = query.offset;

    switch(method) {
        case "GET":

            if (query.method === "getAvailablePlans") {
                return await getSubscriptionPlans();
            }

            break;
        case "POST":

            if (query.method === "addNewPlan") {
                const body = await readBody<{ data: any }>(event);


                return await addSubscriptionPlan(body);
            }

            break;
        case "DELETE":

            if (query.method === "removePlan") {
                const body = await readBody<{ id: string }>(event);
                return await deleteSubscriptionPlan(body.id);
            }

            break;
        case "PATCH": 
            
            if (query.method === "updateCurrentPlan") {
                const body = await readBody<{ id: string; data: UpdatePlanData }>(event);
                return await updateSubscriptionPlan(body.id, body.data);
            }

            break;
    }
})