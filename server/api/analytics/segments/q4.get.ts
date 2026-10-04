// server/api/analytics/segments/q4.get.ts
//
// GET /api/analytics/segments/q4?from=&to=&questionId=4

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const questionId = parseInt((query.questionId as string) ?? "4", 10);
  const range = parseRange(query);
  const rows = await getSegmentBreakdown(questionId, range.from, range.to);
  return { questionId, from: range.from, to: range.to, rows };
});
