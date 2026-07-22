<template>
  <div class="auth-wrapper">
    <div class="bg-overlay">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
      <div class="grid-lines" />
    </div>

    <div class="auth-card" ref="cardRef">
      <div class="panel-visual" ref="visualRef">
        <div class="panel-content">
          <div class="brand-mark" ref="brandRef">
            <span class="brand-icon">✦</span>
          </div>

          <div class="visual-text" ref="visualTextRef">
            <h2 class="visual-title">
              {{ isLogin ? 'З поверненням' : 'Приєднуйтесь' }}
            </h2>
            <p class="visual-desc">
              {{ isLogin
                ? 'Увійдіть, щоб продовжити свою творчу подорож'
                : 'Створіть акаунт і відкрийте нові можливості' }}
            </p>
          </div>

          <div class="floating-badges" ref="badgesRef">
            <span class="badge" v-for="b in badges" :key="b">{{ b }}</span>
          </div>
        </div>

        <svg class="deco-lines" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="100" x2="400" y2="300" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <line x1="0" y1="250" x2="400" y2="50"  stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <circle cx="320" cy="80"  r="60" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          <circle cx="80"  cy="420" r="90" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        </svg>
      </div>

      <div class="panel-form" ref="formPanelRef">
        <div class="tabs" ref="tabsRef">
          <button
            class="tab"
            :class="{ active: isLogin }"
            @click="switchMode(true)"
          >Увійти</button>
          <button
            class="tab"
            :class="{ active: !isLogin }"
            @click="switchMode(false)"
          >Реєстрація</button>
          <div class="tab-indicator" ref="indicatorRef" />
        </div>

        <div class="form-body" ref="formBodyRef">
          <transition name="field-fade" mode="out-in">
            <div v-if="!isLogin" class="field-group" key="name">
              <label class="field-label">Ім'я</label>
              <div class="field-wrap">
                <span class="field-icon">◈</span>
                <input
                  v-model="form.name"
                  type="text"
                  class="field-input"
                  placeholder="Ваше ім'я"
                  autocomplete="name"
                />
              </div>
            </div>
          </transition>

          <div class="field-group">
            <label class="field-label">Email</label>
            <div class="field-wrap" :class="{ focused: focus.email }">
              <span class="field-icon">◉</span>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                placeholder="you@example.com"
                autocomplete="email"
                @focus="focus.email = true"
                @blur="focus.email = false"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Пароль</label>
            <div class="field-wrap" :class="{ focused: focus.password }">
              <span class="field-icon">◎</span>
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                autocomplete="current-password"
                @focus="focus.password = true"
                @blur="focus.password = false"
              />
              <button class="pass-toggle" @click="showPass = !showPass" type="button">
                {{ showPass ? '▲' : '▼' }}
              </button>
            </div>
          </div>

          <transition name="field-fade">
            <div v-if="!isLogin" class="field-group" key="confirm">
              <label class="field-label">Підтвердження пароля</label>
              <div class="field-wrap">
                <span class="field-icon">◎</span>
                <input
                  v-model="form.confirm"
                  :type="showPass ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  autocomplete="new-password"
                />
              </div>
            </div>
          </transition>

          <div v-if="isLogin" class="extras">
            <label class="remember">
              <input type="checkbox" v-model="form.remember" />
              <span>Запам'ятати мене</span>
            </label>
            <button class="forgot" type="button">Забули пароль?</button>
          </div>

          <button class="submit-btn" ref="submitRef" @click="handleSubmit" type="button">
            <span class="btn-text">{{ isLogin ? 'Увійти' : 'Створити акаунт' }}</span>
            <span class="btn-arrow">→</span>
          </button>

          <div class="divider"><span>або</span></div>

          <button class="google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Продовжити з Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useNuxtApp } from '#app'

const { $gsap: gsap } = useNuxtApp()

// State
const isLogin   = ref(true)
const showPass  = ref(false)

const form = reactive({
  name: '', email: '', password: '', confirm: '', remember: false
})
const focus = reactive({ email: false, password: false })

const badges = ['UI/UX', 'Design', 'Creative', 'Dev']

// Refs
const cardRef      = ref(null)
const visualRef    = ref(null)
const brandRef     = ref(null)
const visualTextRef= ref(null)
const badgesRef    = ref(null)
const formPanelRef = ref(null)
const tabsRef      = ref(null)
const indicatorRef = ref(null)
const formBodyRef  = ref(null)
const submitRef    = ref(null)

// Mount animation
onMounted(() => {
  if (!gsap) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from(cardRef.value, {
    opacity: 0, scale: 0.92, y: 40, duration: 0.8
  })
  .from(brandRef.value, {
    opacity: 0, scale: 0, rotation: -180, duration: 0.6
  }, '-=0.4')
  .from(visualTextRef.value?.children, {
    opacity: 0, y: 20, stagger: 0.12, duration: 0.5
  }, '-=0.3')
  .from(badgesRef.value?.children, {
    opacity: 0, y: 12, stagger: 0.08, duration: 0.4
  }, '-=0.2')
  .from(tabsRef.value, {
    opacity: 0, y: -16, duration: 0.4
  }, '-=0.5')
  .from(formBodyRef.value?.children, {
    opacity: 0, x: 24, stagger: 0.08, duration: 0.5
  }, '-=0.3')

  // Orb float
  gsap.to('.orb-1', { y: -30, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  gsap.to('.orb-2', { y:  20, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 })
  gsap.to('.orb-3', { y: -15, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 })

  // Badge float
  gsap.to('.badge', {
    y: -4, stagger: { each: 0.3, repeat: -1, yoyo: true }, ease: 'sine.inOut', duration: 1.5
  })
})

// Switch mode
function switchMode(login) {
  if (isLogin.value === login) return
  if (!gsap) { isLogin.value = login; return }

  gsap.to(formBodyRef.value, {
    opacity: 0, x: login ? -20 : 20, duration: 0.2,
    onComplete: async () => {
      isLogin.value = login
      await nextTick()
      gsap.to(formBodyRef.value, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' })
      gsap.from(formBodyRef.value.children, {
        opacity: 0, y: 12, stagger: 0.06, duration: 0.4, ease: 'power2.out'
      })
    }
  })

  // Animate visual text
  gsap.to(visualTextRef.value?.children, {
    opacity: 0, y: -10, duration: 0.2,
    onComplete: async () => {
      await nextTick()
      gsap.to(visualTextRef.value?.children, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 })
    }
  })
}

// Submit
function handleSubmit() {
  if (!gsap) return
  gsap.timeline()
    .to(submitRef.value, { scale: 0.96, duration: 0.1 })
    .to(submitRef.value, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
}
</script>


<style scoped lang="scss">
@use '../../styles/mixins' as mixins;

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--soft-white);
  font-family: var(--font-aeonik);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.bg-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--emerald-green), transparent);
  top: -120px;
  left: -100px;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--dark-green), transparent);
  bottom: -100px;
  right: -80px;
}
.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--soft-green), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 51, 35, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 51, 35, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}

.auth-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 900px;
  min-height: 580px;
  border-radius: var(--radius-medium);
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-card);
  position: relative;
  z-index: 1;
}

.loader_layout {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 51, 35, 0.15);
  backdrop-filter: blur(7px);
  z-index: 5;
}

.loader_bg {
  width: 100px;
  height: 100px;
  background: var(--dark-green);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loader_content {
  width: 60px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, var(--emerald-green) 90%, #0000);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  20% { background-position: 0% 0%, 50% 50%, 100% 50%; }
  40% { background-position: 0% 100%, 50% 0%, 100% 50%; }
  60% { background-position: 0% 50%, 50% 100%, 100% 0%; }
  80% { background-position: 0% 50%, 50% 50%, 100% 100%; }
}

.panel-visual {
  background: linear-gradient(135deg, var(--surface-green) 0%, var(--soft-green) 100%);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.deco-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  line, circle {
    stroke: rgba(0, 51, 35, 0.08);
  }
}

.panel-content {
  position: relative;
  z-index: 1;
}

.brand-mark {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--dark-green), var(--emerald-green));
  border-radius: var(--radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
  box-shadow: var(--shadow-small);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.brand-icon {
  font-size: 22px;
  color: var(--soft-white);
}

.visual-title {
  font-family: var(--font-playfair);
  font-size: clamp(28px, 3vw, 38px);
  font-weight: var(--font-regular);
  color: var(--text-primary);
  line-height: 1.15;
  margin-bottom: 14px;
}
.visual-desc {
  @include mixins.fz-body($color: var(--text-secondary));
  max-width: 260px;
}

.panel-form {
  background: var(--white);
  padding: 44px 44px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.tabs {
  display: flex;
  position: relative;
  background: var(--light-grey);
  border-radius: var(--radius-full);
  padding: 4px;
}

.tab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  @include mixins.button-font;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s;
}
.tab.active {
  color: var(--text-primary);
}

.tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 2%;
  width: calc(50% - 4px);
  background: var(--white);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-card);
  transition: all ease 0.3s;
}
.tab-right {
  left: 98%;
  transform: translateX(-98%);
  transition: all ease 0.3s;
}
.tabs:has(.tab:last-child.active) .tab-indicator {
  transform: translateX(100%);
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  justify-content: center;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.register_name_wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  flex: 1;

  .first_name,
  .last_name {
    width: 100%;
    height: auto;
  }
}

.field-label {
  @include mixins.caption-font($color: var(--text-secondary));
  font-weight: var(--font-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.field-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-small);
  padding: 0 14px;
  background: var(--soft-white);
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;
}
.field-wrap.focused,
.field-wrap:focus-within {
  border-color: var(--emerald-green);
  box-shadow: 0 0 0 3px rgba(0, 221, 120, 0.12);
  background: var(--white);
}

.error-field-border {
  border: 1px solid var(--danger);
}

.field-icon {
  font-size: 14px;
  color: var(--gray-4);
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: var(--font-aeonik);
  font-size: var(--text-sm);
  color: var(--text-primary);
  padding: 13px 0;
  outline: none;
}
.field-input::placeholder {
  color: var(--gray-5);
}

.error_message {
  font-size: var(--text-xs);
  color: var(--danger);
  font-weight: var(--font-regular);
  position: absolute;
  bottom: -25%;
  transform: translateX(-50%);
  left: 50%;
  background: var(--white);
  border: 1px solid var(--border-light);
  padding: 3px 5px;
  border-radius: 4px;
  white-space: nowrap;
}

.pass-toggle {
  border: none;
  background: none;
  color: var(--gray-5);
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  transition: color 0.2s;
  width: 20px;
  height: 20px;
}
.pass-toggle:hover {
  color: var(--text-primary);
}

.extras {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
}
.remember input {
  accent-color: var(--emerald-green);
}

.forgot {
  border: none;
  background: none;
  font-family: var(--font-aeonik);
  font-size: var(--text-sm);
  color: var(--emerald-green);
  cursor: pointer;
  transition: opacity 0.2s, color 0.2s;
}
.forgot:hover {
  color: var(--dark-green);
}

.submit_btn {
  @include mixins.button-primary($bg: var(--dark-green));
  width: 100%;
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  margin-top: 20px;
  color: var(--soft-white);
  opacity: 1 !important;
}
.submit_btn:hover {
  box-shadow: 0 12px 32px rgba(0, 51, 35, 0.25);
}
.btn-arrow {
  font-size: 18px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--gray-4);
  font-size: var(--text-xs);
}
.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-light);
}

.google-btn {
  @include mixins.button-outline;
  width: 100%;
  font-size: var(--text-sm);
}

.field-fade-enter-active,
.field-fade-leave-active {
  transition: all 0.25s ease;
}
.field-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.field-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .auth-card {
    grid-template-columns: 1fr;
    max-width: 440px;
    min-height: auto;
  }
  .panel-visual {
    padding: 32px 28px 28px;
    min-height: 200px;
  }
  .floating-badges {
    margin-top: 20px;
  }
  .brand-mark {
    margin-bottom: 24px;
  }
  .visual-desc {
    display: none;
  }
  .panel-form {
    padding: 28px 24px;
  }
}

@media (max-width: 400px) {
  .panel-form {
    padding: 22px 18px;
  }
  .auth-card {
    border-radius: 20px;
  }
}
</style>
