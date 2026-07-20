import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {

    const { sellerId } = await readBody(event);

    if (!sellerId) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }
    
    try {

        const getMyLeadsReq = await prisma.seller.findUnique({
            where: {
                id: sellerId
            },
            include: {
                leads: {
                    include: {
                        answers: true
                    }
                }
            }
        })

        if (!getMyLeadsReq) {
            return {
                statusCode: 404,
                message: "Seller not found"
            }
        }

        return {
            statusCode: 200,
            message: "Success",
            data: getMyLeadsReq.leads
        }


    } catch (err) {
        console.log("Something went wrong", err);

        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }
    }
})