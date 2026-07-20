import { prisma } from "../../../../prisma/prisma";

async function getAllCallbacks() {


    try{

        const gettingCallbacks = await prisma.callback.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: gettingCallbacks  
        }

        

    } catch (error) {
        console.error("Prisma callback.findMany error:", error);
        return {
            message: "No data received",
            error: error

        }
    }

}

export default getAllCallbacks;