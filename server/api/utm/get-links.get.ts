import { defineEventHandler } from "h3"
import { prisma } from "../../../prisma/prisma";;

export default defineEventHandler(async (event) => {
    
    try {

        const getLink = await prisma.generatedLinks.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        })

        return {
            statusCode: 200,
            message: "Success",
            data: getLink  
        }

    } catch (err) {

        console.log(`Something went wrong ${err}`);

        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }

    }
})