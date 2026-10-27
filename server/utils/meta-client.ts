// server/utils/meta-client.ts
//
// Обёртка над Meta Marketing API /insights (read-only, ads_read permission).
// Это НЕ Conversions API — если нужно ещё отправлять события обратно в Meta
// для оптимизации рекламы, это отдельная интеграция.
//
// Env:
//   META_AD_ACCOUNT_ID   напр. "act_1234567890" (с префиксом act_)
//   META_ACCESS_TOKEN    System User token с правом ads_read
//   META_GRAPH_VERSION   (опционально) напр. "v26.0"

// Marketing API versions are retired roughly every few months, so the version is configurable.
// v26.0 was released 29 July 2026; check https://developers.facebook.com/docs/graph-api/changelog
// every few months and bump META_GRAPH_VERSION in .env instead of editing code.
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v26.0";

export interface MetaInsightRow {
  date: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
  spend: number;
  impressions: number;
  clicks: number;
  reach: number | null;
}

interface MetaApiResponse {
  data: Array<{
    date_start: string;
    campaign_id: string;
    campaign_name: string;
    adset_id: string;
    adset_name: string;
    ad_id: string;
    ad_name: string;
    spend?: string;
    impressions?: string;
    clicks?: string;
    reach?: string;
  }>;
  paging?: { next?: string };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export async function fetchMetaInsights(since: string, until: string): Promise<MetaInsightRow[]> {
  const adAccountId = requireEnv("META_AD_ACCOUNT_ID");
  const accessToken = requireEnv("META_ACCESS_TOKEN");

  const fields = [
    "campaign_id",
    "campaign_name",
    "adset_id",
    "adset_name",
    "ad_id",
    "ad_name",
    "spend",
    "impressions",
    "clicks",
    "reach",
  ].join(",");

  const timeRange = encodeURIComponent(JSON.stringify({ since, until }));

  let url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${adAccountId}/insights` +
    `?level=ad&time_increment=1&fields=${fields}&time_range=${timeRange}` +
    `&limit=500&access_token=${accessToken}`;

  const results: MetaInsightRow[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Meta API error ${res.status}: ${body}`);
    }
    const json = (await res.json()) as MetaApiResponse;

    for (const row of json.data) {
      results.push({
        date: row.date_start,
        campaignId: row.campaign_id,
        campaignName: row.campaign_name,
        adsetId: row.adset_id,
        adsetName: row.adset_name,
        adId: row.ad_id,
        adName: row.ad_name,
        spend: row.spend ? parseFloat(row.spend) : 0,
        impressions: row.impressions ? parseInt(row.impressions, 10) : 0,
        clicks: row.clicks ? parseInt(row.clicks, 10) : 0,
        reach: row.reach ? parseInt(row.reach, 10) : null,
      });
    }

    url = json.paging?.next ?? "";
  }

  return results;
}
