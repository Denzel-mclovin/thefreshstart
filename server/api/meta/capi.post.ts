import crypto from "node:crypto";

function hashSha256(val?: string | null): string | undefined {
  if (!val) return undefined;
  const cleaned = val.trim().toLowerCase();
  if (!cleaned) return undefined;
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

function cleanPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  return hashSha256(digits);
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const datasetId =
    process.env.META_DATASET_ID ||
    process.env.META_PIXEL_ID ||
    "1850667959625451";

  const token =
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.META_ACCESS_TOKEN;

  if (!token) {
    console.warn("[Meta CAPI] Warning: META_CAPI_ACCESS_TOKEN or META_ACCESS_TOKEN is not set in environment.");
    return {
      success: false,
      message: "META_CAPI_ACCESS_TOKEN is missing on server",
      skipped: true,
    };
  }

  const graphVersion = process.env.META_GRAPH_VERSION || "v26.0";

  // IP extraction (handles Vercel / proxies)
  const forwardedFor = getRequestHeader(event, "x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() ||
    getRequestIP(event, { xForwardedFor: true }) ||
    undefined;

  const userAgent = getRequestHeader(event, "user-agent") || undefined;

  const eventName = body.eventName || "Lead";
  const eventId = body.eventId; // Critical for deduplication with browser pixel
  const eventTime = body.eventTime || Math.floor(Date.now() / 1000);
  const eventSourceUrl =
    body.eventSourceUrl ||
    getRequestHeader(event, "referer") ||
    "https://thefreshstart.com";

  // Build user_data with SHA-256 hashing for PII
  const userData: Record<string, any> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };

  if (body.fbc) userData.fbc = body.fbc;
  if (body.fbp) userData.fbp = body.fbp;

  if (body.email) userData.em = [hashSha256(body.email)];
  if (body.phone) {
    const hashedPhone = cleanPhone(body.phone);
    if (hashedPhone) userData.ph = [hashedPhone];
  }
  if (body.firstName) userData.fn = [hashSha256(body.firstName)];
  if (body.lastName) userData.ln = [hashSha256(body.lastName)];
  if (body.externalId) userData.external_id = [hashSha256(body.externalId)];

  const eventData: Record<string, any> = {
    event_name: eventName,
    event_time: eventTime,
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: userData,
    custom_data: body.customData || {},
  };

  const payload: Record<string, any> = {
    data: [eventData],
  };

  // Optional test code from Meta Events Manager "Test Events" tab
  if (body.testEventCode || process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code =
      body.testEventCode || process.env.META_TEST_EVENT_CODE;
  }

  try {
    const metaUrl = `https://graph.facebook.com/${graphVersion}/${datasetId}/events?access_token=${token}`;
    const metaResponse = await $fetch<any>(metaUrl, {
      method: "POST",
      body: payload,
    });

    return {
      success: true,
      metaResponse,
      eventId,
      eventName,
    };
  } catch (err: any) {
    console.error("[Meta CAPI Error]", err?.data || err?.message || err);
    return {
      success: false,
      error: err?.data || err?.message || "Failed to dispatch CAPI event",
      eventId,
    };
  }
});
