import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async () => {
  try {
    const total = await prisma.lead.count()

    const completed = await prisma.lead.count({
      where: {
        status: 'COMPLETED'
      }
    })

    const inProgress = await prisma.lead.count({
      where: {
        status: 'IN_PROGRESS'
      }
    })

    const unassigned = await prisma.lead.count({
      where: {
        sellerId: null,
        status: 'COMPLETED'
      }
    })

    const abandoned = await prisma.lead.count({
      where: {
        status: 'IN_PROGRESS'
      }
    })


    const dropoffData = await prisma.lead.groupBy({
      by: ['lastStep'],
      _count: true
    })

    const dropoffByStep: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    dropoffData.forEach(item => {
      if (item.lastStep >= 1 && item.lastStep <= 5) {
        dropoffByStep[item.lastStep] = item._count
      }
    })


    const utmData = await prisma.lead.groupBy({
      by: ['utmSource'],
      _count: true
    })

    const utmSources: Record<string, number> = {}

    utmData.forEach(item => {
      utmSources[item.utmSource || 'Direct'] = item._count
    })

    return {
      success: true,
      analytics: {
        total,
        completed,
        abandoned,
        inProgress,
        unassigned,
        dropoffByStep,
        utmSources
      }
    }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      message: 'Analytics error'
    }
  }
})