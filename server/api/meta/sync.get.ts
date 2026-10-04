// server/api/meta/sync.get.ts
//
// GET /api/meta/sync — последние 20 запусков синка. Для индикатора
// "last synced" на дашборде.

export default defineEventHandler(async () => {
  const logs = await prisma.metaSyncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });
  return { logs };
});
