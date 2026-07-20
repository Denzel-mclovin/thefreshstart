import { prisma } from '../../../prisma/prisma'

export default defineEventHandler(async () => {

    console.log("enter")
  try {
    const leads = await prisma.lead.findMany({
      include: {
        seller: true,
        answers: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(leads, "leads")

    return {
      success: true,
      leads
    }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch leads'
    }
  }
})