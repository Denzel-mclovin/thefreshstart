<template>
  <div class="cookie_modal_overlay">
    <div class="cookie_modal">
      <div class="cookie_content">
        <img class="cookie_content_icon" src="/icons/protect.png" alt="icon" />

        <div class="cookie_content_wrapper">
          <div class="content_head">
            <h2>Your privacy, your choice</h2>
            <button class="close_btn" @click="modalStore.closeModal()">
              ✕
            </button>
          </div>

          <p class="content_middle">
            We use cookies to run this site, understand how it's used, and
            improve your experience. You can accept all, reject non-essential,
            or manage your preferences. See our

            <NuxtLink 
              class="accent_text"
              to="/privacy-policy"
            > 
              Privacy Policy 
            </NuxtLink>

            .
          </p>

          <div class="content_bottom" >
            <button class="accent" @click="acceptCookies">Accept All</button>

            <button class="secondary"  @click="cookieSettingsHandler">Customize</button>

            <!-- <button class="transparent" @click="cookieSettingsHandler">
              Manage preferences
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUTMTracking } from "../../composables/useUTMTracking";

const { saveUTMFromStore } = useUTMTracking();

const modalStore = useModalStore();

const cookieConsent = useCookie("cookie_consent", {
  maxAge: 60 * 60 * 24 * 365,
});

const acceptCookies = () => {
  cookieConsent.value = "accepted";

  saveUTMFromStore();

  modalStore.closeModal();
};

const cookieSettingsHandler = () => {
  modalStore.closeModal();
  modalStore.showModal("CookieSettings", {}, true);
};
</script>

<style lang="scss" scoped>
@use "/styles/mixins.scss" as mixins;

.cookie_modal_overlay {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.cookie_modal {
  width: fit-content;
  height: auto;
  display: flex;
  justify-content: flex-start;
  padding: 0 0 1.5vw 1.5vw;
  pointer-events: auto;

  @media screen and (max-width: 768px) {
    padding: 0 2vw 2vw;
    position: absolute;
    bottom: 15px;
  }
}

.cookie_content {
  background: white;
  border-radius: 12px;
  padding: 15px 20px;
  max-width: 80%;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  border: 1px solid rgba(0, 51, 35, 0.2);
  position: relative;

  &_icon {
    width: 40px;
    height: 40px;
    position: relative;
    aspect-ratio: 1/1;
    background: #e0f6ec;
    border-radius: 7px;
    padding: 10px;
  }

  &_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
  }

  .content_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 50px;
    width: 100%;
    height: auto;

    h2 {
      @include mixins.fz-h5;
      color: var(--dark-green);
    }

    button {
      color: var(--gray-6);
      transition: all ease 0.3s;
      aspect-ratio: 1/1;
      width: 20px;
      height: 20px;
      line-height: normal;

      @media screen and (min-width: 1024px) {
        &:hover {
          color: var(--dark-grey);
          transition: all ease 0.3s;
        }
      }

      @media screen and (max-width: 768px) {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 25px;
        height: 25px;
        font-size: 1.3rem;
      }
    }
  }

  .content_middle {
    @include mixins.fz-body-large;
    color: var(--text-secondary);
    line-height: 1.2;

    a {
      cursor: pointer;
      color: var(--emerald-green);
    }
  }

  .content_bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: auto;


    .accent {
      @include mixins.button-primary;
    }

    .secondary {
      @include mixins.button-ghost;
    }

    .transparent {
      @include mixins.button-ghost;
      background: transparent;
      border: 1px solid transparent;
      color: var(--gray-6);

      @media screen and (min-width: 1024px) {
        &:hover {
          border: 1px solid var(--gray-3);
          color: var(--dark-grey);
        }
      }
    }

    button {
      border-radius: 6px;

      @media screen and (max-width: 768px) {
        flex: 1;
        white-space: nowrap;
        font-size: clamp(0.75rem, 2vw, 1.2rem) !important;
        width: 100%;
      }
    }

    @media screen and (max-width: 768px) {
      margin: 0 auto;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media screen and (max-width: 375px) {
      flex-direction: column;

    }

  }

  @media screen and (max-width: 1024px) {
    max-width: 90%;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 25px 20px;
    max-width: 100%;
    gap: 15px;
  }
  @media screen and (max-width: 480px) {
    padding: 20px 15px;
  }
}
</style>
