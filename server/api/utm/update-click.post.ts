import { prisma } from "../../../prisma/prisma";;
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const { utm_source, utm_content } = body

    if (!utm_source && !utm_content) return { ok: false }

    const where: any = {}

    if (utm_source) where.utmSource = utm_source
    if (utm_content) where.utmContent = utm_content


    try {
        const result = await prisma.generatedLinks.updateMany({
            // where: {
            //     utmSource: utm_source || undefined,
            //     utmContent: utm_content || undefined
            // },
            where,
            data: {
                clickBuy: {
                    increment: 1
                }
            }
        })

        console.log(result, 'result update click')

        if (result.count === 0) {
        return { ok: false, message: 'Link not found' }
        }

        return { ok: true }

    } catch (e) {
        console.error(e)
        return { ok: false }
    }
})