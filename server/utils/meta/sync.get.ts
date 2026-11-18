import { prisma } from '../../../prisma/prisma';

export default defineEventHandler(async () => {
  const logs = await prisma.metaSyncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });
  return { logs };
});
