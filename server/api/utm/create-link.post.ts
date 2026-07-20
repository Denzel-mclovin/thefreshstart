import { prisma } from "../../../prisma/prisma";;
import { defineEventHandler } from "h3";



export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { fullUrl, source, content, name } = body

    if (!body) {
        return {
            statusCode: 400,
            message: "Missing body"
        }
    }

    try {

        const createLink = await prisma.generatedLinks.create({
            data: {
                fullUrl,
                utmSource: source,
                utmContent: content,
                utmName: name
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: createLink
        }

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            message: "Something went wrong",
            err: err
        }
    }

});