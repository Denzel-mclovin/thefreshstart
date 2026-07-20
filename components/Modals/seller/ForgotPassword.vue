<template>
  <transition name="modal-fade" appear>
    <div class="modal" @click.self="modalStore.closeModal">
      <div class="modal_wrapper">
        <div class="modal-card" @click.stop>
          <button
            class="modal-close"
            type="button"
            @click="modalStore.closeModal"
          >
            ✕
          </button>

          <h3 class="modal-title">Reset password</h3>
          <p class="modal-desc">
            Enter your email and we'll send you a link to reset your
            password.
          </p>

          <div class="field-group">
            <label class="field-label">Email</label>
            <div
              class="field-wrap"
              :class="{ 'error-field-border': forgotPasswordError }"
            >
              <span class="field-icon">◉</span>
              <input
                v-model="forgotPasswordEmail"
                type="email"
                class="field-input"
                placeholder="you@example.com"
                autocomplete="email"
                @input="forgotPasswordError = ''"
                @keyup.enter="handleForgotPasswordSubmit"
              />
              <div class="error_message" v-if="forgotPasswordError">
                {{ forgotPasswordError }}
              </div>
            </div>
          </div>

          <button
            class="submit_btn"
            type="button"
            :disabled="forgotPasswordLoading"
            @click="handleForgotPasswordSubmit"
          >
            <span class="btn-text">
              {{ forgotPasswordLoading ? "Sending..." : "Send reset link" }}
            </span>
            <span class="btn-arrow">→</span>
          </button>

          <p v-if="forgotPasswordSuccess" class="modal-success">
            Check your email for the reset link.
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { useModalStore } from "../../../stores/modal";
import { useSellerAuth } from "../../../composables/useSellerAuth";

const modalStore = useModalStore();
const { resetPasswordForSeller } = useSellerAuth();

// REFS
const forgotPasswordEmail = ref("");
const forgotPasswordError = ref("");
const forgotPasswordLoading = ref(false);
const forgotPasswordSuccess = ref(false);

async function handleForgotPasswordSubmit() {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail.value);

  if (!valid) {
    forgotPasswordError.value = "Please enter a valid email address";
    return;
  }

  forgotPasswordLoading.value = true;

  try {
    await resetPasswordForSeller(forgotPasswordEmail.value);
    forgotPasswordSuccess.value = true;
  } catch (err) {
    forgotPasswordError.value = "Something went wrong, try again";
  } finally {
    forgotPasswordLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

:root {
  --radius-card: 28px;
  --radius-inp: 14px;
  --c-accent: #e63e3e;
}

.modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(8, 9, 13, 0.65);
  backdrop-filter: blur(6px);
  pointer-events: auto;
  z-index: 1000;
  padding: 20px;
}

.modal_wrapper {
  position: relative;
  height: auto;
  width: 100%;
  max-width: 400px;
}

.modal-card {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: var(--radius-card);
  padding: 36px 32px 32px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 30px 80px rgba(0, 0, 0, 0.5);
  font-family: "DM Sans", sans-serif;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}
.modal-close:hover {
  color: #333;
}

.modal-title {
  font-family: "DM Serif Display", serif;
  font-size: 24px;
  color: #111;
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 13px;
  color: #777;
  line-height: 1.6;
  margin-bottom: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.field-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #e8e8ec;
  border-radius: var(--radius-inp);
  padding: 0 14px;
  background: #fafafa;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  position: relative;
}
.field-wrap:focus-within {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(230, 62, 62, 0.1);
  background: #fff;
}

.error-field-border {
  border: 1px solid red;
}

.field-icon {
  font-size: 14px;
  color: #bbb;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  color: #111;
  padding: 13px 0;
  outline: none;
}
.field-input::placeholder {
  color: #bbb;
}

.error_message {
  font-size: 0.7rem;
  color: red;
  font-weight: 400;
  position: absolute;
  bottom: -25%;
  transform: translateX(-50%);
  left: 50%;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 3px 5px;
  border-radius: 4px;
  white-space: nowrap;
}

.submit_btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #e63e3e 0%, #ff6b35 100%);
  color: #fff;
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 15px 24px;
  border-radius: var(--radius-inp);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  box-shadow: 0 8px 24px rgba(230, 62, 62, 0.3);
  transition:
    box-shadow 0.2s,
    opacity 0.2s;
}
.submit_btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit_btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px rgba(230, 62, 62, 0.4);
  opacity: 0.93;
}
.btn-arrow {
  font-size: 18px;
}

.modal-success {
  margin-top: 14px;
  font-size: 13px;
  color: #1a8a4a;
  text-align: center;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>