<template>
  <div class="auth-wrapper">
    <div class="bg-overlay">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
      <div class="grid-lines" />
    </div>

    <div class="reset-card">
      <div class="brand-mark">
        <span class="brand-icon">✦</span>
      </div>

      <template v-if="status === 'checking'">
        <h2 class="reset-title">Checking your link…</h2>
        <p class="reset-desc">Please wait a moment.</p>
      </template>

      <template v-else-if="status === 'invalid'">
        <h2 class="reset-title">Link expired</h2>
        <p class="reset-desc">
          This password reset link is invalid or has expired. Please request
          a new one.
        </p>
        <NuxtLink to="/seller/login" class="submit_btn as-link">
          <span class="btn-text">Back to login</span>
          <span class="btn-arrow">→</span>
        </NuxtLink>
      </template>

      <template v-else-if="status === 'success'">
        <h2 class="reset-title">Password updated</h2>
        <p class="reset-desc">
          Your password has been changed. You can now sign in.
        </p>
        <NuxtLink to="/seller/login" class="submit_btn as-link">
          <span class="btn-text">Go to login</span>
          <span class="btn-arrow">→</span>
        </NuxtLink>
      </template>

      <template v-else>
        <h2 class="reset-title">Set a new password</h2>
        <p class="reset-desc">
          Enter and confirm your new password below.
        </p>

        <div class="field-group">
          <label class="field-label">New password</label>
          <div
            class="field-wrap"
            :class="{ 'error-field-border': errors.password }"
          >
            <span class="field-icon">
                ◎
            </span>
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="new-password"
              @input="errors.password = ''"
            />
            <button
              class="pass-toggle"
              type="button"
              @click="showPass = !showPass"
            >
              {{ showPass ? "Hide" : "Show" }}
            </button>
            <div class="error_message" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Confirm password</label>
          <div
            class="field-wrap"
            :class="{ 'error-field-border': errors.confirm }"
          >
            <span class="field-icon">◎</span>
            <input
              v-model="form.confirm"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="new-password"
              @input="errors.confirm = ''"
              @keyup.enter="handleSubmit"
            />
            <div class="error_message" v-if="errors.confirm">
              {{ errors.confirm }}
            </div>
          </div>
        </div>

        <button
          class="submit_btn"
          type="button"
          :disabled="submitting"
          @click="handleSubmit"
        >
          <span class="btn-text">
            {{ submitting ? "Updating…" : "Update password" }}
          </span>
          <span class="btn-arrow">→</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useSellerAuth } from "../../composables/useSellerAuth";

const { updateSellerPassword } = useSellerAuth();
const supabase = useCustomSupabase();

// status: 'checking' | 'ready' | 'invalid' | 'success'
const status = ref("checking");
const showPass = ref(false);
const submitting = ref(false);

const form = reactive({ password: "", confirm: "" });
const errors = reactive({ password: "", confirm: "" });

let authListener = null;

onMounted(async () => {

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    status.value = "ready";
  }

  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      status.value = "ready";
    }
  });
  authListener = data.subscription;

  setTimeout(() => {
    if (status.value === "checking") {
      status.value = "invalid";
    }
  }, 3000);
});

onBeforeUnmount(() => {
  authListener?.unsubscribe();
});

function validate() {
  errors.password = "";
  errors.confirm = "";

  let valid = true;

  if (form.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  if (form.password !== form.confirm) {
    errors.confirm = "Passwords do not match";
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;

  try {
    await updateSellerPassword(form.password);
    status.value = "success";
  } catch (err) {
    errors.confirm = "Something went wrong, try again";
  } finally {
    submitting.value = false;
  }
}

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

.reset-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: var(--white);
  border-radius: var(--radius-medium);
  padding: 44px 40px;
  box-shadow: var(--shadow-card);
}

.brand-mark {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--dark-green), var(--emerald-green));
  border-radius: var(--radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  box-shadow: var(--shadow-small);
}
.brand-icon {
  font-size: 22px;
  color: var(--soft-white);
}

.reset-title {
  font-family: var(--font-playfair);
  font-weight: var(--font-regular);
  font-size: 26px;
  color: var(--text-primary);
  margin-bottom: 10px;
}
.reset-desc {
  @include mixins.fz-body($color: var(--text-secondary));
  margin-bottom: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
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
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
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
.pass-toggle {
  border: none;
  background: none;
  color: var(--gray-5);
  cursor: pointer;
  font-size: var(--text-xs);
  white-space: nowrap;
  transition: color 0.2s;
}
.pass-toggle:hover {
  color: var(--text-primary);
}
.error_message {
  font-size: var(--text-xs);
  color: var(--danger);
  position: absolute;
  bottom: -22px;
  left: 0;
}

.submit_btn {
  @include mixins.button-primary($bg: var(--dark-green));
  width: 100%;
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  margin-top: 8px;
  color: var(--soft-white);
  text-decoration: none;
}
.submit_btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit_btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px rgba(0, 51, 35, 0.25);
}
.as-link {
  margin-top: 4px;
}
.btn-arrow {
  font-size: 18px;
}
</style>