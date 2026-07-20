import { prisma } from "../../../prisma/prisma";


export default defineEventHandler(async (event) => {

    const {leadId, sellerId} = await readBody(event);

    if (!leadId || !sellerId) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }
    

    try {

        const getLead = await prisma.lead.findUnique({
            where: {
                id: leadId
            }
        });

        if (!getLead) {
            return {
                statusCode: 404,
                message: "Lead not found"
            }
        }

        const getSeller = await prisma.seller.findUnique({
            where: {
                id: sellerId
            }
        });

        if (!getSeller) {
            return {
                statusCode: 404,
                message: "Seller not found"
            }
        }

        const takingLeadHandler = await prisma.lead.update({
            where: {
                id: leadId
            },
            data: {
                sellerId: sellerId,
                assignedAt: new Date()
                
            }
        });

        if (!takingLeadHandler) {
            return {
                statusCode: 500,
                message: "Error taking lead"
            }
        }

        return {
            statusCode: 200,
            message: "Lead taken successfully"
        }

    } catch (err) {

        return {
            statusCode: 500,
            message: "Error taking lead"
        }
    }




})