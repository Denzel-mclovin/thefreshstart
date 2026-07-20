import { prisma } from "../../../prisma/prisma";;

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await prisma.session.update({
    where: { id: body.sessionId },
    data: {
      endedAt: new Date(),
      timeSpent: body.timeSpent
    }
  })

  return { ok: true }
})