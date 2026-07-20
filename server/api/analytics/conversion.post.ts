import { prisma } from "../../../prisma/prisma";


export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await prisma.conversion.create({
    data: {
      sessionId: body.sessionId,
      type: body.type
    }
  })

  return { success: true }
})