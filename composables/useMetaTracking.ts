// composables/useMetaTracking.ts
import { useAttribution } from "./useAttribution";

export function useMetaTracking() {
  const { attribution, syncFbp } = useAttribution();

  function generateEventId(prefix = "evt"): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  /**
   * Fires the QuizStart custom event.
   * Triggered when the user answers Q1.
   */
  async function trackQuizStart(params: {
    eventId?: string;
  }) {
    syncFbp();
    const eventId = params.eventId || generateEventId("quiz_start");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const customData = {
      content_name: "Quiz Started Q1",
    };

    // 1. Browser Custom Event
    if (typeof window !== "undefined" && window.fbq) {
      try {
        (window.fbq as any)("trackCustom", "QuizStart", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel QuizStart Error]", err);
      }
    }

    // 2. Server CAPI Event
    try {
      await $fetch("/api/meta/capi", {
        method: "POST",
        body: {
          eventName: "QuizStart",
          eventId,
          eventSourceUrl: currentUrl,
          fbc: attribution.value?.fbc,
          fbp: attribution.value?.fbp,
          customData,
        },
      });
    } catch (err) {
      console.warn("[Meta CAPI QuizStart Error]", err);
    }

    return eventId;
  }

  /**
   * Fires the Lead event simultaneously via Browser Pixel and CAPI (deduplicated by eventId).
   * Triggered at Q4 completion or Lead submission.
   */
  async function trackLead(params: {
    q4FinancialReadiness: string;
    financingFlag?: boolean;
    email?: string;
    eventId?: string;
  }) {
    syncFbp();
    const eventId = params.eventId || generateEventId("lead");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const customData = {
      content_name: "Quiz Lead Q4",
      q4_financial_readiness: params.q4FinancialReadiness,
      financing_flag: params.financingFlag ?? (params.q4FinancialReadiness === "C"),
      value: 3000,
      currency: "USD",
    };

    // 1. Browser Pixel Event
    if (typeof window !== "undefined" && window.fbq) {
      try {
        // For advanced matching, we can pass user data if available
        const userData = params.email ? { em: [params.email] } : {};
        // Note: browser side hashing is usually handled by Meta if passed as plain text in some contexts,
        // but standard practice for fbq('init') is to provide hashed data.
        // However, fbq('track', 'Lead', data, { eventID }) doesn't take user data.
        // User data should be provided in fbq('init').
        (window.fbq as any)("track", "Lead", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel Lead Error]", err);
      }
    }

    // 2. Server-side CAPI Event
    try {
      await $fetch("/api/meta/capi", {
        method: "POST",
        body: {
          eventName: "Lead",
          eventId,
          eventSourceUrl: currentUrl,
          fbc: attribution.value?.fbc,
          fbp: attribution.value?.fbp,
          email: params.email,
          customData,
        },
      });
    } catch (err) {
      console.warn("[Meta CAPI Lead Error]", err);
    }

    return eventId;
  }

  /**
   * Fires QuizCompleted custom event at Q5 or Lead submission.
   */
  async function trackQuizCompleted(params: {
    q5ConcernCode: string;
    q5ConcernFreetext?: string;
    email?: string;
    eventId?: string;
  }) {
    syncFbp();
    const eventId = params.eventId || generateEventId("quiz_done");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const customData = {
      content_name: "Quiz Completed Q5",
      q5_concern_code: params.q5ConcernCode,
      q5_concern_freetext: params.q5ConcernFreetext || "",
    };

    // 1. Browser Custom Event
    if (typeof window !== "undefined" && window.fbq) {
      try {
        (window.fbq as any)("trackCustom", "QuizCompleted", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel QuizCompleted Error]", err);
      }
    }

    // 2. Server CAPI Event
    try {
      await $fetch("/api/meta/capi", {
        method: "POST",
        body: {
          eventName: "QuizCompleted",
          eventId,
          eventSourceUrl: currentUrl,
          fbc: attribution.value?.fbc,
          fbp: attribution.value?.fbp,
          email: params.email,
          customData,
        },
      });
    } catch (err) {
      console.warn("[Meta CAPI QuizCompleted Error]", err);
    }

    return eventId;
  }

  /**
   * Fires the Schedule event simultaneously via Browser Pixel and CAPI (deduplicated by eventId).
   * Triggered upon call booking (ts_booking_made).
   */
  async function trackSchedule(params: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    q5ConcernCode?: string;
    eventId?: string;
  }) {
    syncFbp();
    const eventId = params.eventId || generateEventId("sched");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const customData = {
      content_name: "Call Scheduled",
      q5_concern_code: params.q5ConcernCode,
    };

    // 1. Browser Pixel Event
    if (typeof window !== "undefined" && window.fbq) {
      try {
        (window.fbq as any)("track", "Schedule", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel Schedule Error]", err);
      }
    }

    // 2. Server CAPI Event with PII
    try {
      await $fetch("/api/meta/capi", {
        method: "POST",
        body: {
          eventName: "Schedule",
          eventId,
          eventSourceUrl: currentUrl,
          fbc: attribution.value?.fbc,
          fbp: attribution.value?.fbp,
          email: params.email,
          phone: params.phone,
          firstName: params.firstName,
          lastName: params.lastName,
          customData,
        },
      });
    } catch (err) {
      console.warn("[Meta CAPI Schedule Error]", err);
    }

    return eventId;
  }

  return {
    generateEventId,
    trackLead,
    trackQuizCompleted,
    trackSchedule,
  };
}
