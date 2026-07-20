import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {
    

    const { sellerId, leadId } = await readBody(event);

    console.log(sellerId, leadId, 'PARAMS');

    if (!sellerId || !leadId) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }

    try {

        await prisma.lead.update({
            where: {
                id: leadId
            },
            data: {
                sellerId: null,
                assignedAt: null
            }
        })

        return {
            statusCode: 200,
            message: "Lead removed successfully"
        }



    } catch (err) {
        console.log("Something went wrong", err);
        return {
            statusCode: 500,
            message: "Something went wrong"
        }
    }
})