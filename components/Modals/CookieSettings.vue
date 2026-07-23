<template>
  <div class="cookie_settings_overlay">
    <div class="cookie_modal cookie_settings">
      <div class="cookie_content cookie_settings">
        <div class="text">
          <h3>Cookie Preferences</h3>

          <p>
            You can control how we use cookies. Essential cookies are required
            for the website to function properly.
          </p>
        </div>

        <div class="buttons top_buttons">
          <button
            class="primary_btn"
            :class="activeBtn === 'all' ? 'top_btn_active' : ''"
            @click="acceptAll"
          >
            Accept All
          </button>

          <!-- <button
            class="secondary_btn"
            :class="activeBtn === 'essential' ? 'top_btn_active' : ''"
            @click="onlyRequired"
          >
            Essentials
          </button> -->

          <button
            class="secondary_btn"
            :class="activeBtn === 'reject' ? 'top_btn_active' : ''"
            @click="rejectAll"
          >
            Reject All
          </button>
        </div>

        <div class="tabs">
          <button
            :class="{ active: tab === 'essential' }"
            @click="tab = 'essential'"
          >
            Essential
          </button>

          <button
            :class="{ active: tab === 'analytics' }"
            @click="tab = 'analytics'"
          >
            Analytics
          </button>

          <button :class="{ active: tab === 'ads' }" @click="tab = 'ads'">
            Advertising
          </button>
        </div>

        <div class="tab_description">
          <p v-if="tab === 'essential'">
            Essential cookies are required for the basic operation of our
            website, including checkout functionality, security, and fraud
            prevention. These cookies cannot be disabled.
          </p>

          <p v-if="tab === 'analytics'">
            Analytics cookies help us understand how visitors use our website.
            This information is aggregated and used to improve performance and
            user experience.
          </p>

          <p v-if="tab === 'ads'">
            Advertising cookies help us measure the effectiveness of advertising
            campaigns and understand which marketing channels bring visitors to
            our website.
          </p>
        </div>

        <div class="controls">
          <div class="control_item">
            <div class="control_text">
              <h4>Essential Cookies</h4>
              <p>Required for the website to function properly.</p>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="essential" checked disabled />
              <span class="slider"></span>
            </label>
          </div>

          <div class="control_item">
            <div class="control_text">
              <h4>Analytics Cookies</h4>
              <p>Help us understand traffic and website usage.</p>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="analytics" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="control_item">
            <div class="control_text">
              <h4>Advertising Cookies</h4>
              <p>Used to measure advertising campaign performance.</p>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="ads" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="footer">
          <NuxtLink to="/privacy-policy" target="_blank">
            Privacy Policy
          </NuxtLink>

          <div class="buttons">
            <button class="secondary_btn" @click="modalStore.closeModal">
              Cancel
            </button>

            <button class="primary_btn" @click="saveSettings">
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUTMTracking } from '../../composables/useUTMTracking'

const modalStore = useModalStore()
const cookieConsent = useCookie('cookie_consent', { maxAge: 60*60*24*365 })

const tab = ref('essential')
const activeBtn = ref('all')

const essential = ref(true)
const analytics = ref(true)
const ads = ref(true)

const { saveUTMFromStore } = useUTMTracking()

const saveSettings = () => {
  cookieConsent.value = {
    essential: true,
    analytics: analytics.value,
    ads: ads.value
  }
  saveUTMFromStore()

  modalStore.closeModal()
}

const acceptAll = () => {
  activeBtn.value = 'all'
  essential.value = true
  analytics.value = true
  ads.value = true
}

const onlyRequired = () => {
  activeBtn.value = 'essential'
  essential.value = true
  analytics.value = false
  ads.value = false
}

const rejectAll = () => {
  activeBtn.value = 'reject'
  essential.value = true
  analytics.value = false
  ads.value = false
}

onMounted(() => {
  if (cookieConsent.value) {
    essential.value = cookieConsent.value.essential ?? true
    analytics.value = cookieConsent.value.analytics ?? true
    ads.value = cookieConsent.value.ads ?? true
  }
})
</script>

<style lang="scss" scoped>
.cookie_settings_overlay {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 51, 35, 0.45);
  backdrop-filter: blur(3px);
  pointer-events: auto;
}
.cookie_settings {
  width: 95vw;
  max-width: 900px;
  max-height: 80vh;
  overflow-y: scroll;

  display: flex;
  justify-content: center;

  /* убираем скроллбар, скролл остаётся рабочим */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }

  @media screen and (max-width: 768px) {
    width: 100%;

    height: 100vh;
    overflow-y: scroll;
    max-height: unset;
    justify-content: flex-start;
  }
}

.cookie_settings .cookie_content {
  background: var(--white);
  border-radius: var(--radius-medium);

  padding: 25px 30px;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: flex-start;
  align-items: center;

  @media screen and (max-width: 768px) {
    padding: 25px 25px;
    border-radius: 0;
    gap: 25px;
  }
  @media screen and (max-width: 480px) {
    padding: 15px 10px !important;
    gap: 20px;
  }
}

.cookie_settings .text {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cookie_settings h3 {
  font-size: 2rem;
  font-weight: var(--font-regular);

  font-family: var(--font-playfair);

  color: var(--text-primary);
  line-height: 150%;
  text-align: start;
}

.cookie_settings p {
  font-size: 1.25rem;
  font-family: var(--font-aeonik);
  color: var(--text-secondary);

  line-height: 150%;
}

.cookie_settings .top_buttons {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  @media screen and (max-width: 768px) {
    gap: 8px;
  }

  @media screen and (max-width: 480px) {
    gap: 6px;
  }
}

.cookie_settings .top_buttons button {
  padding: 10px 18px;
  white-space: nowrap;
  border-radius: var(--radius-small);
  border: none;
  cursor: pointer;
  background: var(--light-grey);
  color: var(--text-primary);

  font-size: 1.25rem;
  font-family: var(--font-aeonik);
  flex: 1;
  transition: background 0.2s, color 0.2s;

  @media screen and (max-width: 768px) {
    font-size: clamp(0.8rem, 3.8vw, 1.2rem);
  }

  @media screen and (max-width: 480px) {
    padding: 8px 12px;
  }
}

.cookie_settings .top_buttons .top_btn_active {
  background: var(--dark-green);
  color: var(--soft-white);
}

.tab_description {
  width: 100%;

  p {
    font-size: 1.2rem;
    font-family: var(--font-aeonik);
    line-height: 150%;
    color: var(--text-secondary);
  }
}

.controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media screen and (max-width: 768px) {
    gap: 12px;
  }
  @media screen and (max-width: 480px) {
    gap: 10px;
  }
}

.control_item {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px 0;

  border-bottom: 1px solid var(--border-light);
  gap: 20px;
}

.control_text {
  max-width: 550px;

  h4 {
    font-size: 1.3rem;
    font-family: var(--font-playfair);
    color: var(--text-primary);
    margin-bottom: 5px;

    @media screen and (max-width: 480px) {
      font-size: clamp(0.8rem, 4vw, 1.3rem);
    }
  }

  p {
    font-size: 1.1rem;
    font-family: var(--font-aeonik);
    color: var(--text-secondary);
  }

  @media screen and (max-width: 480px) {
    flex: 1 0 70%;
  }
}

.tabs {
  width: 100%;

  display: flex;
  gap: 25px;

  border-bottom: 1px solid var(--border-light);
}

.tabs button {
  background: none;
  border: none;

  font-size: 1.25rem;

  font-family: var(--font-aeonik);

  padding-bottom: 10px;

  cursor: pointer;

  color: var(--text-muted);
  transition: color 0.2s, border-color 0.2s;
}

.tabs .active {
  color: var(--dark-green);

  border-bottom: 2px solid var(--emerald-green);
}

.tab_content {
  width: 100%;
}

.cookie_item {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cookie_info {
  max-width: 600px;
}

.cookie_info h4 {
  font-size: 1.4rem;

  font-family: var(--font-playfair);
  color: var(--text-primary);

  margin-bottom: 6px;
}

.cookie_info p {
  font-size: 1.1rem;

  font-family: var(--font-aeonik);

  color: var(--text-secondary);
}

.switch {
  position: relative;

  display: inline-block;

  width: 46px;
  height: 26px;
}

.switch input {
  opacity: 0;
}

.slider {
  position: absolute;
  inset: 0;

  background: var(--gray-3);

  border-radius: var(--radius-full);

  transition: 0.3s;
}

.slider:before {
  content: "";

  position: absolute;

  height: 20px;
  width: 20px;

  left: 3px;
  bottom: 3px;

  background: var(--white);

  border-radius: 50%;

  transition: 0.3s;
}

input:checked + .slider {
  background: var(--emerald-green);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.footer {
  width: 100%;

  display: flex;

  justify-content: space-between;

  align-items: center;
  gap: 20px;

  @media screen and (max-width: 420px) {
    flex-direction: column-reverse;
  }
}

.footer a {
  font-size: 1.1rem;

  font-family: var(--font-aeonik);

  color: var(--text-muted);
  transition: color 0.2s;

  &:hover {
    color: var(--dark-green);
  }

  @media screen and (max-width: 420px) {
    text-align: end;
    width: 100%;
    height: auto;
  }
}

.footer .buttons {
  display: flex;

  gap: 12px;

  button {
    padding: 10px 18px;
    white-space: nowrap;
    border-radius: var(--radius-small);
    border: none;
    cursor: pointer;
    background: var(--light-grey);
    color: var(--text-primary);
    transition: background 0.2s, opacity 0.2s;

    @media screen and (max-width: 420px) {
      font-size: clamp(0.8rem, 4vw, 1.1rem);
      padding: 7px 10px;
      flex: 1;
    }
  }

  .primary_btn {
    background: var(--dark-green);
    color: var(--soft-white);
    font-weight: var(--font-bold);
  }

  @media screen and (max-width: 420px) {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .cookie_settings .cookie_content {
    padding: 25px 20px;
  }

  .tabs {
    gap: 15px;

    @media screen and (max-width: 480px) {
      width: 100%;
      justify-content: center;
    }
  }

  .tabs button {
    font-size: 1.1rem;

    @media screen and (max-width: 480px) {
      font-size: clamp(0.8rem, 4vw, 1.1rem);
      flex: 1;
    }
  }
}

@media screen and (max-width: 480px) {
  .cookie_settings h3 {
    font-size: clamp(1rem, 3.8vw, 1.5rem);
  }

  .cookie_settings p {
    font-size: clamp(0.8rem, 3.8vw, 1.2rem);
  }
}
</style>
