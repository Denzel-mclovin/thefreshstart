import { prisma } from "../../../prisma/prisma";


export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const { phoneNumber, userEmail, firstName, lastName, quizComment, sessionId } = body;




    if (!phoneNumber && !userEmail && !firstName && !lastName && !quizComment) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }

     console.log(phoneNumber, userEmail, firstName, lastName, quizComment, sessionId, "body");


    if (!sessionId) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }

    console.log(sessionId, "sessionId")

    try {

        const getUser = await prisma.lead.findUnique({
            where: {
                sessionId: sessionId
            }
        })

        if (!getUser) {
            return {
                statusCode: 400,
                message: "Lead not found"
            }
        }

        await prisma.lead.update({
            where: {
                sessionId: sessionId
            },
            data: {
                phone: phoneNumber,
                email: userEmail,
                firstName,
                lastName,
                quizComment,
                status: "COMPLETED",
                qualified: false,
                completedAt: new Date()
            }
        })

        return {
            statusCode: 200,
            message: "Lead disqualified"
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Error disqualifying lead"
        }
    }

})