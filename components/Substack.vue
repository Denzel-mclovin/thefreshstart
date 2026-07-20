<template>

    <section class="section substack" id="newsletter">
        <div data-supascribe-embed-id="395643912758" data-supascribe-feed=""></div>
    </section>


</template>


<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://js.supascribe.com/v1/loader/lxlt3M6LErOdSnFuSuxcjaKY6b62.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
