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
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --c-bg: #08090d;
  --c-accent: #e63e3e;
  --c-accent-2: #ff6b35;
  --radius-card: 28px;
  --radius-inp: 14px;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg);
  font-family: "DM Sans", sans-serif;
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
  opacity: 0.25;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #e63e3e, transparent);
  top: -120px;
  left: -100px;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #3e4de6, transparent);
  bottom: -100px;
  right: -80px;
}
.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ff6b35, transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}

.reset-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: var(--radius-card);
  padding: 44px 40px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 40px 100px rgba(0, 0, 0, 0.6);
}

.brand-mark {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(228, 183, 183, 0.35);
}
.brand-icon {
  font-size: 22px;
  color: #fff;
}

.reset-title {
  font-family: "DM Serif Display", serif;
  font-size: 26px;
  color: #111;
  margin-bottom: 10px;
}
.reset-desc {
  font-size: 14px;
  color: #777;
  line-height: 1.6;
  margin-bottom: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
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
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
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
.pass-toggle {
  border: none;
  background: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}
.pass-toggle:hover {
  color: #555;
}
.error_message {
  font-size: 0.7rem;
  color: red;
  position: absolute;
  bottom: -22px;
  left: 0;
}

.submit_btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-2) 100%);
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
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(230, 62, 62, 0.3);
  transition: box-shadow 0.2s, opacity 0.2s;
  text-decoration: none;
}
.submit_btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit_btn:hover:not(:disabled) {
  box-shadow: 0 12px 32px rgba(230, 62, 62, 0.4);
  opacity: 0.93;
}
.as-link {
  margin-top: 4px;
}
.btn-arrow {
  font-size: 18px;
}
</style>