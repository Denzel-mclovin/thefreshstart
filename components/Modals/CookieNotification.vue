<template>
  <div class="cookie_modal_overlay">
    <div class="cookie_modal">
      <div class="cookie_content">
        <h3>We use cookies to improve your experience on our website.</h3>

        <div class="buttons">
          <button @click="cookieSettingsHandler" class="secondary">
            Manage Preferences
          </button>

          <button @click="acceptCookies" class="primary">
            Accept All
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useUTMTracking } from '../../composables/useUTMTracking'

const { saveUTMFromStore } = useUTMTracking()

const modalStore = useModalStore()

const cookieConsent = useCookie('cookie_consent', {
  maxAge: 60 * 60 * 24 * 365
})

const acceptCookies = () => {

  cookieConsent.value = "accepted"

  saveUTMFromStore()

  modalStore.closeModal()

}

const cookieSettingsHandler = () => {
  modalStore.closeModal()
  modalStore.showModal("CookieSettings", {}, true)
}

</script>

<style lang="scss" scoped>
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
  border-radius: 8px;
  padding: 15px 20px;
  max-width: 80%;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  border: 1px solid rgba(55, 28, 71, 0.2);
  position: relative;

  h3 {
    font-size: clamp(0.75rem, 3.8vw, 1rem);
    font-weight: 700;
    font-family: "Libre Baskerville", sans-serif;
    font-style: normal;
    line-height: 150%;
    text-align: center;

    @media screen and (max-width: 768px) {
      line-height: 130%;
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    button {
      width: fit-content;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: 700;
      white-space: nowrap;
      border: none;
      cursor: pointer;

      font-size: 1rem;
      font-weight: 400;
      font-family: "Josefin Sans", sans-serif;

      font-style: normal;
      line-height: 150%;
      transition: all ease 0.3s;

      @media screen and (max-width: 768px) {
        width: 100%;
        font-size: 1.125rem;
        line-height: 130%;
      }

      @media screen and (max-width: 480px) {
        font-size: clamp(0.8rem, 3.8vw, 1.2rem);
        padding: 8px 12px;
      }
    }

    .primary {
      background: #f7ac0b;
      color: white;
      @media screen and (min-width: 1024px) {
        &:hover {
          background: #f0a607;

          transition: all ease 0.3s;
        }
      }
    }

    .secondary {
      color: #333;
      background: #edf0f4;

      @media screen and (min-width: 1024px) {
        &:hover {
          background: #e6e9ed;
          transition: all ease 0.3s;
        }
      }
    }

    @media screen and (max-width: 768px) {
      width: 100%;
      height: auto;
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
