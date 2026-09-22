const config = useRuntimeConfig();

const activeCampaignFetch = async <T>(
  endpoint: string,
  options: any = {}
) => {
  try {
    return await $fetch(
      `${config.activeCampaignUrl}/api/3/${endpoint}`,
      {
        ...options,
        headers: {
          "Api-Token": config.activeCampaignApiKey,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    );
  } catch (error: any) {
    console.error(
      "ActiveCampaign API error:",
      error?.data || error?.response?._data || error
    );

    throw error;
  }
};

export const activeCampaign = {
  get<T>(endpoint: string, options = {}) {
    return activeCampaignFetch<T>(endpoint, {
      method: "GET",
      ...options,
    });
  },

  post<T>(endpoint: string, body: any, options = {}) {
    return activeCampaignFetch<T>(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  },

  put<T>(endpoint: string, body: any, options = {}) {
    return activeCampaignFetch<T>(endpoint, {
      method: "PUT",
      body,
      ...options,
    });
  },

  delete<T>(endpoint: string, options = {}) {
    return activeCampaignFetch<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  },
};