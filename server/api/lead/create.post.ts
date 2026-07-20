import { prisma } from "../../../prisma/prisma";


export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const { phoneNumber, userEmail, firstName, lastName, quizComment, sessionId } = body;

    console.log(phoneNumber, userEmail, firstName, lastName, quizComment, sessionId, "body");



    if (!phoneNumber && !userEmail && !firstName && !lastName && !quizComment) {
        return {
            statusCode: 400,
            message: "Missing required fields"
        }
    }

    try {

        const checkLead = await prisma.lead.findUnique({
            where: {
                sessionId
            }
        })

        if (!checkLead) {
            return {
                statusCode: 400,
                message: "Lead already exists"
            }
        }

        const lead = await prisma.lead.update({
            where: {
                sessionId
            },
            data: {
                phone: phoneNumber,
                email: userEmail,
                firstName,
                lastName,
                quizComment,
                completedAt: new Date(),
                status: "COMPLETED",
                qualified: true,
                // answers
            }
        })

        return {
            statusCode: 200,
            message: "Lead updated successfully",
            lead
        }

    } catch (err) {

        return {

            statusCode: 500,
            message: `Something went wrong ${err}`

        }

    }
})
