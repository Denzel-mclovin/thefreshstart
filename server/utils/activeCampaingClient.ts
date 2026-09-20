// const config = useRuntimeConfig();

// const activeCampaignFetch = async (
//   endpoint: string,
//   options: any = {}
// ) => {
//   return await $fetch(
//     `${config.activeCampaignUrl}/api/3/${endpoint}`,
//     {
//       ...options,

//       headers: {
//         "Api-Token": config.activeCampaignApiKey,
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//       },
//     }
//   );
// };

// export const activeCampaign = {
//   get(endpoint: string, options = {}) {
//     return activeCampaignFetch(endpoint, {
//       method: "GET",
//       ...options,
//     });
//   },

//   post(endpoint: string, body: any, options = {}) {
//     return activeCampaignFetch(endpoint, {
//       method: "POST",
//       body,
//       ...options,
//     });
//   },

//   put(endpoint: string, body: any, options = {}) {
//     return activeCampaignFetch(endpoint, {
//       method: "PUT",
//       body,
//       ...options,
//     });
//   },

//   delete(endpoint: string, options = {}) {
//     return activeCampaignFetch(endpoint, {
//       method: "DELETE",
//       ...options,
//     });
//   },
// };

const config = useRuntimeConfig();

const activeCampaignFetch = async (
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
  get(endpoint: string, options = {}) {
    return activeCampaignFetch(endpoint, {
      method: "GET",
      ...options,
    });
  },

  post(endpoint: string, body: any, options = {}) {
    return activeCampaignFetch(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  },

  put(endpoint: string, body: any, options = {}) {
    return activeCampaignFetch(endpoint, {
      method: "PUT",
      body,
      ...options,
    });
  },

  delete(endpoint: string, options = {}) {
    return activeCampaignFetch(endpoint, {
      method: "DELETE",
      ...options,
    });
  },
};