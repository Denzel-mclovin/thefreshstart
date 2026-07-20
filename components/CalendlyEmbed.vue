<template>
  <div
    class="calendly-inline-widget"
    :data-url="url"
    style="min-width:320px;height:700px;"
  />
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  if (!document.querySelector('#calendly-widget')) {
    const script = document.createElement('script')
    script.id = 'calendly-widget'
    script.src =
      'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>