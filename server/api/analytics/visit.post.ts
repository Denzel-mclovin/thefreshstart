import { prisma } from "../../../prisma/prisma";;

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const visit = await prisma.session.create({
    data: {
      id: body.sessionId,
      visitorId: body.visitorId,
      attributions: body.utmSource
        ? {
            create: {
              utmSource: body.utmSource,
              utmContent: body.utmContent
            }
          }
        : undefined
    }
  })

  return visit
})