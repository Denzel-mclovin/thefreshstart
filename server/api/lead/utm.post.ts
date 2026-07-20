import { defineEventHandler } from "#imports";
import { prisma } from "../../../prisma/prisma";

interface Body {
    sessionId: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
}



export default defineEventHandler(async (event) => {

    const body = await readBody(event) as Body;


    const {sessionId, utmSource, utmContent, utmMedium, utmCampaign, utmTerm} = body;


    // console.log(sessionId, utmSource, utmContent, "body");

    if (!sessionId) {
        return {
            statusCode: 400,
            message: "Missing body"
        }
    }

    try {

        const sendUtmReq = await prisma.lead.update({
            where: {
                sessionId
            },
            data: {
                utmSource,
                utmMedium,
                utmCampaign,
                utmTerm,
                utmContent,
            }
        })

        if (!sendUtmReq) {
            return {
                statusCode: 500,
                message: "Something went wrong",
            }
        }

        return {
            statusCode: 200,
            message: "Success"
        }


    } catch (err) {

        console.log("Something went wrong", err);

        return {
            statusCode: 500,
            message: "Something went wrong",
        }



    }
})