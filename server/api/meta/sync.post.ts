// server/api/meta/sync.post.ts
//
// POST /api/meta/sync
// POST /api/meta/sync?date=2026-09-23
// POST /api/meta/sync?from=2026-09-01&to=2026-09-23
//
// Тянет day+ad insights из Meta и делает upsert в AdInsight. Вызывается
// из cron'а (Supabase Edge Function по расписанию / внешний cron, который
// бьёт в этот роут), не руками с фронта. Каждый запуск логируется в
// MetaSyncLog — пропуск синка виден, а не молчаливая дыра в данных.
//
// Перед деплоем закройте роут секретом (заголовок с cron secret) — здесь
// авторизации нет намеренно, т.к. это зависит от вашей текущей схемы миддлвари.

function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date as string | undefined;
  const since = date ?? (query.from as string | undefined) ?? yesterday();
  const until = date ?? (query.to as string | undefined) ?? since;

  const log = await prisma.metaSyncLog.create({
    data: {
      rangeStart: new Date(since),
      rangeEnd: new Date(until),
      status: "RUNNING",
    },
  });

  try {
    const rows = await fetchMetaInsights(since, until);

    let synced = 0;
    for (const row of rows) {
      await prisma.adInsight.upsert({
        where: { date_adId: { date: new Date(row.date), adId: row.adId } },
        create: {
          date: new Date(row.date),
          campaignId: row.campaignId,
          campaignName: row.campaignName,
          adsetId: row.adsetId,
          adsetName: row.adsetName,
          adId: row.adId,
          adName: row.adName,
          spend: toCents(row.spend),
          impressions: row.impressions,
          clicks: row.clicks,
          reach: row.reach ?? undefined,
        },
        update: {
          campaignName: row.campaignName,
          adsetName: row.adsetName,
          adName: row.adName,
          spend: toCents(row.spend),
          impressions: row.impressions,
          clicks: row.clicks,
          reach: row.reach ?? undefined,
        },
      });
      synced += 1;
    }

    await prisma.metaSyncLog.update({
      where: { id: log.id },
      data: { status: "SUCCESS", recordsSynced: synced, finishedAt: new Date() },
    });

    return { ok: true, since, until, recordsSynced: synced };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.metaSyncLog.update({
      where: { id: log.id },
      data: { status: "FAILED", error: message, finishedAt: new Date() },
    });
    throw createError({ statusCode: 502, statusMessage: message });
  }
});
