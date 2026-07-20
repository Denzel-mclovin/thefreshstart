<template>
  <div class="modal_head">
    <div class="title">
      <!-- <img src="/images/sphinks.webp" alt="logo" class="footer-logo" /> -->

      <h2>
        <slot> </slot>
      </h2>
    </div>
    <DefaultBtn @click="emit('cancelBtnMethod')"> close </DefaultBtn>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import DefaultBtn from "./DefaultBtn.vue";

const emit = defineEmits({
  e: "cancelBtnMethod"

})
//   (e: "cancelBtnMethod"): void;
// }>();
</script>

<style lang="scss" scoped>
.modal_head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  border-bottom: 1px solid var(--text-color);
  .title {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    gap: 0.5em;
    h2 {
      font-size: 1.5rem;
      font-weight: 500;
      @media screen and (max-width: 768px) {
        & {
          font-size: clamp(0.8rem, 4vw, 1.5rem);
        }
      }
    }
  }
  img {
    width: 50px;
    @media screen and (max-width: 768px) {
      & {
        width: clamp(30px, 7vw, 50px);
      }
    }
  }
  .button {
    min-width: 100px;
    padding-inline: 5px;
    font-size: 14px;
    height: 35px;
  }
}
</style>
