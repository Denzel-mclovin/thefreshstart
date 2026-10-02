import { defineStore } from 'pinia'

export const useUtmStore = defineStore('utm', () => {

  const utmSource = ref<string | null>(null)
  const utmContent = ref<string | null>(null)
  const utmMedium = ref<string | null>(null)
  const utmCampaign = ref<string | null>(null)
  const utmTerm = ref<string | null>(null)

  const utmLinksList = ref([]);

  const pending = ref(false)

  const setPending = (source: string, content: string, medium?: string, campaign?: string, term?: string) => {
    utmSource.value = source
    utmContent.value = content
    utmMedium.value = medium || null
    utmCampaign.value = campaign || null
    utmTerm.value = term || null
    pending.value = true
  }

  const clearPending = () => {
    pending.value = false
  }

  const createUtmLink = async (linkData: any) => {
    await $fetch('/api/utm/create-link', {
      method: 'POST',
      body: {
        fullUrl: linkData.fullLink.toLowerCase().trim(),
        source: linkData.source.toLowerCase().trim(),
        content: linkData.content.toLowerCase().trim(),
        name: linkData.name.toLowerCase().trim()
      }
    })
    await updateUtmList()
  }


  const getUtmList = async () => {
    const response = await $fetch<any>('/api/utm/get-links', {
      method: 'GET'
    })

    if (response.statusCode === 200) {
      utmLinksList.value = response.data
    }
  }

  const updateUtmList = async () => {
    await getUtmList()
  }

  const deleteUtmLink = async (id: string) => {
    await $fetch('/api/utm/remove-link', {
      method: 'DELETE',
      body: {
        id: id
      }
    })
    await updateUtmList()
  }

  return {
    utmSource,
    utmContent,
    utmMedium,
    utmCampaign,
    utmTerm,
    pending,
    setPending,
    clearPending,
    createUtmLink,
    getUtmList,
    updateUtmList,
    deleteUtmLink,
    utmLinksList
  }

})