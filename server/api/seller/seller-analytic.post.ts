import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {
  try {
    const { sellerId } = await readBody(event);

    if (!sellerId) {
      return {
        success: false,
        message: "Seller id is required"
      };
    }

    const where = {
      sellerId
    };

    const total = await prisma.lead.count({
      where
    });

    const completed = await prisma.lead.count({
      where: {
        ...where,
        status: "COMPLETED"
      }
    });

    const inProgress = await prisma.lead.count({
      where: {
        ...where,
        status: "IN_PROGRESS"
      }
    });

    const qualified = await prisma.lead.count({
      where: {
        ...where,
        qualified: true
      }
    });

    const dropoffData = await prisma.lead.groupBy({
      by: ["lastStep"],
      where,
      _count: true
    });

    const dropoffByStep: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    dropoffData.forEach(item => {
      if (item.lastStep >= 1 && item.lastStep <= 5) {
        dropoffByStep[item.lastStep] = item._count;
      }
    });

    const utmData = await prisma.lead.groupBy({
      by: ["utmSource"],
      where,
      _count: true
    });

    const utmSources: Record<string, number> = {};

    utmData.forEach(item => {
      utmSources[item.utmSource || "Direct"] = item._count;
    });

    return {
      success: true,
      analytics: {
        total,
        completed,
        inProgress,
        qualified,
        dropoffByStep,
        utmSources
      }
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: "Analytics error"
    };
  }
});