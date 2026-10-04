// server/api/analytics/segments/q5.get.ts
//
// GET /api/analytics/segments/q5?from=&to=&questionId=5

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const questionId = parseInt((query.questionId as string) ?? "5", 10);
  const range = parseRange(query);
  const rows = await getSegmentBreakdown(questionId, range.from, range.to);
  return { questionId, from: range.from, to: range.to, rows };
});
