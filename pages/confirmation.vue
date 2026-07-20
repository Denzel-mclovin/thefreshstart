<template>
  <div class="page">
    <TempLinks />

    <ScheduledCall />
    <BeforeTalk />
    <PreparationResource />
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.page {
  @include mixins.page-spacing;
}
</style>
