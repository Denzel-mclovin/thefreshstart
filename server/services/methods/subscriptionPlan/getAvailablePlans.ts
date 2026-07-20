import { prisma } from "../../../../prisma/prisma";






async function getAvailablePlans() {
    try {
        const getAvailablePlan = await prisma.subscriptionPlan.findMany({
            orderBy: {
                amount: 'asc',
            }
        });
        return {
            message: "Success",
            data: getAvailablePlan,
        };
    } catch (error) {
        console.error("Error fetching plans:", error);
        throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch subscription plans",
        });
    }

}


export default getAvailablePlans;