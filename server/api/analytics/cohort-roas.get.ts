// server/api/analytics/cohort-roas.get.ts
//
// GET /api/analytics/cohort-roas?weeks=12

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const weeksRaw = (query.weeks as string) ?? "12";
  const weeks = parseInt(weeksRaw, 10);

  if (Number.isNaN(weeks) || weeks <= 0 || weeks > 104) {
    throw createError({ statusCode: 400, statusMessage: `"weeks" must be a number between 1 and 104, got "${weeksRaw}"` });
  }

  const rows = await getCohortRoas(weeks);
  return { weeks, rows };
});
