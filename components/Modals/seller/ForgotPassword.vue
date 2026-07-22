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

// @import url("https://fonts.
</script>

<style scoped lang="scss">
@use '../../../styles/mixins' as mixins;

.modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 51, 35, 0.45);
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
  background: var(--white);
  border-radius: var(--radius-medium);
  padding: 36px 32px 32px;
  box-shadow: var(--shadow-card), 0 30px 80px rgba(0, 51, 35, 0.2);
  font-family: var(--font-aeonik);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--gray-5);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--text-primary);
}

.modal-title {
  font-family: var(--font-playfair);
  font-weight: var(--font-regular);
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.modal-desc {
  @include mixins.caption-font($color: var(--text-secondary));
  margin-bottom: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
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

.submit_btn {
  @include mixins.button-primary($bg: var(--dark-green));
  width: 100%;
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  margin-top: 20px;
  color: var(--soft-white);
}
.submit_btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit_btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px rgba(0, 51, 35, 0.25);
}
.btn-arrow {
  font-size: 18px;
}

.modal-success {
  margin-top: 14px;
  font-size: var(--text-sm);
  color: var(--emerald-green);
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