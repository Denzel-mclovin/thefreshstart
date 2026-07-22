<template>
  <div class="auth-wrapper">
    <div class="bg-overlay">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
      <div class="grid-lines" />
    </div>

    <div class="auth-card" ref="cardRef">
      <div v-if="loaderState" class="loader_layout">
        <div class="loader_bg">
          <div class="loader_content"></div>
        </div>
      </div>

      <div class="panel-visual" ref="visualRef">
        <div class="panel-content">
          <div class="brand-mark" ref="brandRef">
            <span class="brand-icon">✦</span>
          </div>

          <div class="visual-text" ref="visualTextRef">
            <h2 class="visual-title">
              {{ isLogin ? "Welcome" : "Create an account" }}
            </h2>
            <p class="visual-desc">
              {{
                isLogin
                  ? "Welcome back, please enter your details"
                  : "Sign up and unlock new opportunities"
              }}
            </p>
          </div>
        </div>

        <svg
          class="deco-lines"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0"
            y1="100"
            x2="400"
            y2="300"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="250"
            x2="400"
            y2="50"
            stroke="rgba(255,255,255,0.04)"
            stroke-width="1"
          />
          <circle
            cx="320"
            cy="80"
            r="60"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />
          <circle
            cx="80"
            cy="420"
            r="90"
            stroke="rgba(255,255,255,0.04)"
            stroke-width="1"
          />
        </svg>
      </div>

      <div class="panel-form" ref="formPanelRef">
        <div class="tabs" ref="tabsRef">
          <button
            class="tab"
            :class="{ active: isLogin }"
            @click="switchMode(true)"
          >
            Enter
          </button>
          <button
            class="tab"
            :class="{ active: !isLogin }"
            @click="switchMode(false)"
          >
            Register
          </button>
          <div
            :class="`tab-indicator ${isLoginRef ? 'tab-left' : 'tab-right'}`"
            ref="indicatorRef"
          />
        </div>

        <div class="form-body" ref="formBodyRef">
          <transition name="field-fade" mode="out-in">
            <div v-if="!isLogin" class="field-group" key="register-name">
              <div class="register_name_wrapper">
                <div class="first_name">
                  <label class="field-label">First Name</label>
                  <div
                    class="field-wrap"
                    :class="errors.name ? 'error-field-border' : ''"
                  >
                    <span class="field-icon">◈</span>
                    <input
                      v-model="form.name"
                      type="text"
                      class="field-input"
                      placeholder="Your name"
                      autocomplete="name"
                      @blur="validators.firstName"
                      @input="errors.name = ''"
                    />
                    <div class="error_message" v-if="errors.name">
                      {{ errors.name }}
                    </div>
                  </div>
                </div>
                <div class="last_name">
                  <label class="field-label">Last Name</label>
                  <div
                    class="field-wrap"
                    :class="errors.lastName ? 'error-field-border' : ''"
                  >
                    <span class="field-icon">◈</span>
                    <input
                      v-model="form.lastName"
                      type="text"
                      class="field-input"
                      placeholder="Your last name"
                      autocomplete="name"
                      @blur="validators.lastName"
                      @input="errors.lastName = ''"
                    />
                    <div class="error_message" v-if="errors.lastName">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <div class="field-group">
            <label class="field-label">Email</label>
            <div
              class="field-wrap"
              :class="{
                focused: focus.email,
                'error-field-border': errors.email,
              }"
            >
              <span class="field-icon">◉</span>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                placeholder="you@example.com1"
                autocomplete="email"
                @focus="focus.email = true"
                @blur="
                  focus.email = false;
                  validators.email();
                "
              />
              <div class="error_message" v-if="errors.email">
                {{ errors.email }}
              </div>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Password</label>
            <div
              class="field-wrap"
              :class="{
                focused: focus.password,
                'error-field-border': errors.password,
              }"
            >
              <span class="field-icon">◎</span>
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                autocomplete="current-password"
                @focus="focus.password = true"
                @blur="
                  focus.password = false;
                  validators.password();
                "
              />
              <button
                class="pass-toggle"
                @click="showPass = !showPass"
                type="button"
              >
                <img
                  v-if="!showPass"
                  src="../../public/icons/eyebrow.webp"
                  alt="hide"
                  width="20"
                  height="20"
                />

                <img
                  v-else
                  src="../../public/icons/eye.webp"
                  alt="show"
                  width="20"
                  height="20"
                />
              </button>
              <div class="error_message" v-if="errors.password">
                {{ errors.password }}
              </div>
            </div>
          </div>

          <transition name="field-fade">
            <div v-if="!isLogin" class="field-group" key="confirm">
              <label class="field-label">Confirm Password</label>
              <div class="field-wrap">
                <span class="field-icon">◎</span>
                <input
                  v-model="form.confirm"
                  :type="showPass ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  @blur="validators.confirmPassword()"
                />
                <div class="error_message" v-if="errors.confirm">
                  {{ errors.confirm }}
                </div>
              </div>
            </div>
          </transition>

          <div v-if="isLogin" class="extras">
            <label class="remember">
              <input type="checkbox" v-model="form.remember" />
              <span>Remember me</span>
            </label>
            <button class="forgot" type="button" @click="clickHandler">
              Forgot password?
            </button>
            
          </div>

          <button class="submit_btn" @click="handleSubmit" type="button">
            <span class="btn-text">{{
              isLogin ? "Enter" : "Create Account"
            }}</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
   
  </div>
   <!-- <Teleport to="body">
  
    </Teleport> -->

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
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useNuxtApp } from "#app";
import { useModalStore } from "../../stores/modal";

const { signInSeller, signUpSeller } = useSellerAuth();

const { $gsap: gsap } = useNuxtApp();


const currentModal = computed(() => modalStore.currentModal);
const modalProps = computed(() => modalStore.modalProps);

const modalStore = useModalStore();


const clickHandler = () => {
  console.log("click button")

  console.log(modalStore)
  modalStore.showModal('ForgotPassword', {})
}

// State
const isLogin = ref(true);
const showPass = ref(false);

const form = reactive({
  name: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
  remember: false,
});
const focus = reactive({ email: false, password: false });

const errors = reactive({
  email: "",
  password: "",
  confirm: "",
  name: "",
  lastName: "",
});

// Refs
const cardRef = ref(null);
const visualRef = ref(null);
const brandRef = ref(null);
const visualTextRef = ref(null);
const badgesRef = ref(null);
const formPanelRef = ref(null);
const tabsRef = ref(null);
const indicatorRef = ref(null);
const formBodyRef = ref(null);
const submitRef = ref(null);
const isLoginRef = ref(true);
const loaderState = ref(false);




onMounted(() => {
  if (!gsap) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(cardRef.value, {
    opacity: 0,
    scale: 0.92,
    y: 40,
    duration: 0.8,
  })
    .from(
      brandRef.value,
      {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 0.6,
      },
      "-=0.4",
    )
    .from(
      visualTextRef.value?.children,
      {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.5,
      },
      "-=0.3",
    )
    .from(
      badgesRef.value?.children,
      {
        opacity: 0,
        y: 12,
        stagger: 0.08,
        duration: 0.4,
      },
      "-=0.2",
    )
    .from(
      tabsRef.value,
      {
        opacity: 0,
        y: -16,
        duration: 0.4,
      },
      "-=0.5",
    )
    .from(
      formBodyRef.value?.children,
      {
        opacity: 0,
        x: 24,
        stagger: 0.08,
        duration: 0.5,
      },
      "-=0.3",
    );
});

function switchMode(login) {
  isLoginRef.value = login;

  if (isLogin.value === login) return;
  if (!gsap) {
    isLogin.value = login;
    return;
  }

  gsap.to(formBodyRef.value, {
    opacity: 0,
    x: login ? -20 : 20,
    duration: 0.2,
    onComplete: async () => {
      isLogin.value = login;
      await nextTick();
      gsap.to(formBodyRef.value, {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.from(formBodyRef.value.children, {
        y: 12,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
      });
    },
  });

  gsap.to(visualTextRef.value?.children, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    onComplete: async () => {
      await nextTick();
      gsap.to(visualTextRef.value?.children, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4,
      });
    },
  });
}

const validators = {
  firstName() {
    const valid = form.name.trim().length >= 2;

    errors.name = valid ? "" : "Name must be at least 2 characters";

    return valid;
  },

  lastName() {
    const valid = form.lastName.trim().length >= 2;

    errors.lastName = valid ? "" : "Last name must be at least 2 characters";

    return valid;
  },

  email() {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    errors.email = valid ? "" : "Please enter a valid email address";

    return valid;
  },

  password() {
    const valid = form.password.trim().length >= 6;

    errors.password = valid ? "" : "Password must be at least 6 characters";

    return valid;
  },

  confirmPassword() {
    const valid = form.password === form.confirm;

    errors.confirm = valid ? "" : "Passwords do not match";

    return valid;
  },
};

const validateForm = () => {
  const fields = isLogin.value
    ? ["email", "password"]
    : ["firstName", "lastName", "email", "password", "confirmPassword"];

  return fields.every((field) => validators[field]());
};

// Submit
const handleSubmit = async () => {
  const isValidForm = validateForm();

  if (!isValidForm) return;

  loaderState.value = true;

  try {
    if (isLogin.value) {
      await signInSeller(form.email, form.password);
    } else {
      const res = await signUpSeller({
        email: form.email,
        password: form.password,
        firstName: form.name,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
      });

      if (res.statusCode === 200) {
        alert(
          "User created successfully. To use the app your request should be approved by admin.",
        );

        form.email = "";
        form.password = "";
        form.name = "";
        form.lastName = "";
        form.phoneNumber = "";
        form.confirm = "";
      }
    }
  } catch (err) {
    alert(`Something went wrong, ${err}`);
    loaderState.value = false;
    return;
  } finally {
    loaderState.value = false;
  }
};




definePageMeta({
  layout: false,
});
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
  background: var(--dark-green);
  // background: var(--surface-green);

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
    stroke: rgba(250, 252, 199, 0.05);
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
  box-shadow: 2px 3px 10px rgba(0, 221, 120, 50);
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
  color: #FFF;
  line-height: 1.15;
  margin-bottom: 14px;
}
.visual-desc {
  @include mixins.fz-body($color: var(--surface-green));
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
