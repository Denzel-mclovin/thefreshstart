<template>
  <section class="hero">

    <div class="conntainer">
       <div class="hero_content">
        <h1 class="hero_content_title">
          Same Job. Same Salary. But A Life That Finally 
          <span class="accent_head">
            Gets Ahead.
          </span>
        </h1>
        <p class="hero_content_text">
          A good salary that's gone by the end of the month, no matter how hard you work. 
          The way out isn't a new job or a raise  it's keeping your income and lowering 
          what it costs you to live.
        </p>
        <button 
          class="hero_content_cta"
          @click="modalStore.showModal('QuizPopup')"
        >
          Take the 3-Minute Quiz
        </button>
      </div>

    </div>

   
    
  </section>
</template>

<script setup>

// IMPORTS --------------------------
import { ref, onMounted, nextTick } from "vue";


// STORES --------------------------
import { useModalStore } from "../stores/modal";


// DEFINE STORE --------------------------
const modalStore = useModalStore();


onMounted(async () => {
  await nextTick();
});
</script>

<style lang="scss" scoped>

@use "/styles/mixins.scss" as mixins;

.hero {
  width: 100%;
  height: auto;
  position: relative;
  display: block;

}

.hero_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 820px;
  margin: 0 auto;
  gap: 20px;


  &_rate {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 10px 16px;
    border: 1px solid var(--emerald-green);
    border-radius: 100px;
    gap: 6px;

    span {
      @include mixins.caption-font($color: var(--dark-green));

      @media screen and (max-width: 450px) {
        @include mixins.caption-font($size: 0.75rem, $color: var(--dark-green));
        
      }
    }

    @media screen and (max-width: 375px) {
      padding: 8px 12px;
    }
  }

  &_title {
    @include mixins.fz-h1($color: var(--dark-green), $family: var(--font-playfair));
    text-align: center;

    .accent_head {
      color: var(--emerald-green);
      font-style: italic;
      font-family: var(--font-playfair);
    }
  }

  &_text {
    @include mixins.fz-body($color: var(--dark-green));
    max-width: 575px;
    line-height: 22px;
    text-align: center;
  }

  &_cta {
    margin-top: 20px;
    @include mixins.button-primary;

    @media screen and (max-width: 480px) {
      margin-top: unset;
    }
  }
}
</style>