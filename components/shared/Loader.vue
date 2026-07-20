<template>
  <div class="loader">
    <span class="relative left-4 text-2xl font-bold">
        Loading ...
    </span>
    <div class="dot-wrapper">
        <span v-for="n in 3" :key="n" class="dot" :style="{ animationDelay: `${(n - 1) * 0.3}s` }"></span>


    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.loader {

    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    gap: 1em;
    height: 100%;
    width: 100%;
}

.dot-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;


.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dark-green);
  animation: pulse 0.9s infinite ease-in-out;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

}


</style>
