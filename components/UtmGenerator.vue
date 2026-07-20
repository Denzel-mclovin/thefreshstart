<template>
  <div class="max-w-xl p-5 bg-white border border-gray-300 rounded-xl shadow-sm space-y-4">
    

    <div>
      <label class="text-sm text-gray-500">UTM Source:</label>
      <input
        v-model="social"
        placeholder="enter social media name"
        class="w-full mt-2 border border-solid border-gray-300 rounded-lg px-3 py-2 
               focus:outline-none focus:border-[var(--text-color)]"
      />
    </div>

    <div>
      <label class="text-sm text-gray-500">UTM Content:</label>
      <input
        v-model="content"
        placeholder="enter content name"
        class="w-full mt-2 border border-solid border-gray-300 rounded-lg px-3 py-2 
               focus:outline-none focus:border-[var(--text-color)]"
      />
    </div>

    <div>
      <label class="text-sm text-gray-500">UTM Link Name (optional):</label>
      <input
        v-model="linkName"
        placeholder="enter content name"
        class="w-full mt-2 border border-solid border-gray-300 rounded-lg px-3 py-2 
               focus:outline-none focus:border-[var(--text-color)]"
      />
    </div>

    <p v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </p>

    <button
      @click="generateLink"
      class="w-full bg-[var(--dark-green)] hover:bg-[var(--primary-btn-hover)] transition text-white py-2 rounded-lg"
    >
      Generate Link
    </button>

    <div
      v-if="generatedUrl"
      class="p-3 border border-green-200 bg-green-50 rounded-lg space-y-2"
    >
      <p class="text-sm break-all">
        {{ generatedUrl }}
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="copy"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          Copy
        </button>

        <span v-if="copied" class="text-green-600 text-sm">
          Copied!
        </span>
      </div>
    </div>

  </div>
</template>

<script setup >
import { ref } from 'vue'

import { useUtmStore } from '../stores/utmStore'

const BASE_URL = 'https://www.thepillarsofwisdom.com/'
// const BASE_URL = 'http://localhost:3000/'


const social = ref('')
const content = ref('')
const generatedUrl = ref('')
const linkName = ref('')
const error = ref('')
const copied = ref(false)

const utmStore = useUtmStore();

const generateLink = async () => {
  error.value = ''
  generatedUrl.value = ''

  if (!social.value.trim()) {
    error.value = 'Enter social media name'
    return
  }

  if (!content.value.trim()) {
    error.value = 'Enter content name'
    return
  }

  try {
    const url = new URL(BASE_URL)

    url.searchParams.set('utm_source', social.value.trim())

    if (content.value.trim()) {
      url.searchParams.set('utm_content', content.value.trim())
    }

    generatedUrl.value = url.toString()

    await utmStore.createUtmLink({
      fullLink: generatedUrl.value,
      source: social.value,
      content: content.value,
      name: linkName.value
    })


  } catch (e) {
    error.value = 'Error during generating utm link'
  }
}

const copy = async () => {
  if (!generatedUrl.value) return

  await navigator.clipboard.writeText(generatedUrl.value)

  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

