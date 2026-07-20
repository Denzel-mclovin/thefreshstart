import { prisma } from "../../prisma/prisma";

export const LeadService = {
  async getFreeLeads() {
    return prisma.lead.findMany({
      where: {
        sellerId: null,
        // status: 'COMPLETED',
      },
      include: {
        answers: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
}