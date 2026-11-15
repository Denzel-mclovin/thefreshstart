

export default defineEventHandler(async () => {
  const logs = await prisma.metaSyncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });
  return { logs };
});
