<template>
  <div class="modal">
    <div class="modal_wrapper">
        <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
            User information
        </SharedModalHead>

        <div class="modal_content">
            Content
        </div>

        <div class="bottom_content">

            bottom content
        </div>


    </div>
  </div>
</template>

<script setup lang="ts">
const modalStore = useModalStore();
</script>

<style lang="scss" scoped></style>
