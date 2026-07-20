import { prisma } from "../../../../prisma/prisma";


async function GetSubscriptionsList() {
    try {
        const subscriptions = await prisma.subscription.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return {
            statusCode: 200,
            message: "Success",
            data: subscriptions
        };
    } catch (error) {
        console.error("Prisma subscriptionPlan.findMany error:", error);
        return {
            message: "No data received",
            error: error
        };
    }
}


export default GetSubscriptionsList;