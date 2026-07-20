<template>
  <div class="layout">
    <Header />
    
    <main class="">
      <slot />
    </main>

    <ModalsModal>
      <template #default="{ openModal, closeModal }">
        <component
          :is="currentModal"
          v-bind="modalProps"
          :openModal="openModal"
          :closeModal="closeModal"
        />
      </template>
    </ModalsModal>

    <Footer />
  </div>
</template>

<script setup>
const modalStore = useModalStore();
const currentModal = computed(() => modalStore.currentModal);
const modalProps = computed(() => modalStore.modalProps);
</script>

<style scoped>

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--soft-white);
}
main {
  flex: 1;
  overflow: hidden;
}
</style>
