import { prisma } from "../../../prisma/prisma";;
import { defineEventHandler } from "h3";


export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { id } = body

    if (!id) {
        return {
            statusCode: 400,
            message: "Missing id"
        }
    }

    try {

        const deleteLink = await prisma.generatedLinks.delete({
            where: {
                id: id
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: deleteLink
        }

    } catch (err) {
        console.log(err)
        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }
    }




    
})