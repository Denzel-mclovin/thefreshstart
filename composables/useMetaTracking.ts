import { useAttribution } from "./useAttribution";

export function useMetaTracking() {
  const { attribution, syncFbp } = useAttribution();

  function generateEventId(prefix = "evt"): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  async function trackQuizStart(params: {
    eventId?: string;
  }) {
    syncFbp();
    const eventId = params.eventId || generateEventId("quiz_start");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const customData = {
      content_name: "Quiz Started Q1",
    };

    if (typeof window !== "undefined" && window.fbq) {
      try {
        (window.fbq as any)("trackCustom", "QuizStart", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel QuizStart Error]", err);
      }
    }

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

    if (typeof window !== "undefined" && window.fbq) {
      try {
        const userData = params.email ? { em: [params.email] } : {};

        (window.fbq as any)("track", "Lead", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel Lead Error]", err);
      }
    }

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

    if (typeof window !== "undefined" && window.fbq) {
      try {
        (window.fbq as any)("track", "Schedule", customData, { eventID: eventId });
      } catch (err) {
        console.warn("[Meta Pixel Schedule Error]", err);
      }
    }

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
    trackQuizStart,
    trackLead,
    trackQuizCompleted,
    trackSchedule,
  };
}
