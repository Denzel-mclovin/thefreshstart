// server/api/analytics/funnel.get.ts
//
// GET /api/analytics/funnel?from=2026-07-01&to=2026-09-23&granularity=week

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const range = parseRange(query);
  const rows = await getFunnel(range.from, range.to, range.granularity);
  return { granularity: range.granularity, from: range.from, to: range.to, rows };
});
