<template>
  <div class="affirm-prequal">
    <div class="quiz-icon">💳</div>
    <h2 class="quiz-question">Check your financing eligibility</h2>
    <p class="quiz-sub">
      We've partnered with Affirm for flexible, transparent payment plans. This
      is a <strong>soft check only</strong> — it won't affect your credit score.
    </p>

    <div v-if="affirmState === 'idle'" class="affirm-idle">
      <div class="affirm-badge">
        <img
          src="https://cdn-assets.affirm.com/images/black_logo-transparent_bg.png"
          alt="Affirm"
          class="affirm-logo"
        />
        <p>Pay over time. No hidden fees.</p>
      </div>

      <div class="affirm-features">
        <div class="affirm-feature">
          <span>✅</span>
          <span>Rates from 0–30% APR</span>
        </div>
        <div class="affirm-feature">
          <span>✅</span>
          <span>3–36 month payment plans</span>
        </div>
        <div class="affirm-feature">
          <span>✅</span>
          <span>No impact to credit score to check</span>
        </div>
        <div class="affirm-feature">
          <span>✅</span>
          <span>Decision in seconds</span>
        </div>
      </div>

      <button class="btn-affirm" @click="launchAffirmPrequal">
        Check My Eligibility with Affirm
      </button>

      <button class="btn-skip" @click="$emit('skip')">
        Skip for now → continue without financing
      </button>

      <p class="affirm-legal">
        Rates are between 0–30% APR. A down payment may be required. Subject to
        eligibility check and approval. Payment options through Affirm are
        provided by lending partners:
        <a href="https://www.affirm.com/lenders" target="_blank"
          >affirm.com/lenders</a
        >.
      </p>
    </div>

    <div v-else-if="affirmState === 'loading'" class="affirm-loading">
      <div class="affirm-spinner" />
      <p>Opening Affirm pre-qualification…</p>
    </div>

    <div
      v-else-if="affirmState === 'approved'"
      class="affirm-result affirm-approved"
    >
      <div class="result-badge">🎉</div>
      <h3>You're pre-qualified!</h3>
      <p v-if="approvedLimit">
        Affirm has pre-qualified you for up to
        <strong>${{ approvedLimit.toLocaleString() }}</strong
        >.
      </p>
      <p v-else>Affirm has pre-qualified you for financing.</p>
      <p class="result-sub">
        Your financing option will be applied at booking.
      </p>
      <button class="btn-primary" @click="$emit('approved', approvedLimit)">
        Continue to Booking →
      </button>
    </div>

    <div
      v-else-if="affirmState === 'denied'"
      class="affirm-result affirm-denied"
    >
      <div class="result-badge">😔</div>
      <h3>Not approved this time</h3>
      <p>Unfortunately, Affirm wasn't able to pre-qualify you at this time.</p>
      <p class="result-sub" v-if="requiresFunding">
        Since you indicated financing is required, we're unable to proceed to
        booking. Please contact us directly for alternative payment options.
      </p>
      <p class="result-sub" v-else>
        No worries — you can still continue and pay out of pocket.
      </p>
      <button class="btn-primary" @click="$emit('denied')">
        {{
          requiresFunding
            ? "Contact Us Instead"
            : "Continue Without Financing →"
        }}
      </button>
    </div>

    <div v-if="isDev && affirmState === 'idle'" class="dev-notice">
      <strong>🛠 Dev mode:</strong> Affirm SDK not loaded. Use the buttons below
      to simulate responses.
      <div class="dev-buttons">
        <button @click="simulateApproved">Simulate: Approved ($15,000)</button>
        <button @click="simulateDenied">Simulate: Denied</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// ─── Props & Emits ───────────────────────────────────────────────────────────
const props = defineProps();
const emit = defineEmits(["approved", "denied", "skip"]);

// ─── State ───────────────────────────────────────────────────────────────────
const affirmState = ref("idle");
const approvedLimit = ref(null);

const AFFIRM_PUBLIC_KEY =
  import.meta.env.VITE_AFFIRM_PUBLIC_KEY || "YOUR_PUBLIC_KEY_HERE";
const AFFIRM_ENV = import.meta.env.VITE_AFFIRM_ENV || "sandbox"; // 'sandbox' | 'production'
const AFFIRM_JS_URL =
  AFFIRM_ENV === "production"
    ? `https://cdn1.affirm.com/js/v2/affirm.js`
    : `https://cdn1-sandbox.affirm.com/js/v2/affirm.js`;

const isDev = computed(() => import.meta.env.DEV);

onMounted(() => {
  loadAffirmSDK();
});

function loadAffirmSDK() {
  if (document.querySelector('script[src*="affirm.com/js"]')) return;

  const script = document.createElement("script");
  script.src = AFFIRM_JS_URL;
  script.async = true;
  script.onload = () => {
    if (window.affirm) {
      window.affirm.ui.refresh();
    }
  };
  document.head.appendChild(script);
  window._affirm_config = {
    public_api_key: AFFIRM_PUBLIC_KEY,
    script: AFFIRM_JS_URL,
  };
}
function launchAffirmPrequal() {
  const affirm = window.affirm;

  if (!affirm) {
    if (isDev.value) {
      affirmState.value = "idle";
      alert("[Dev] Affirm SDK not loaded. Use the simulate buttons below.");
    } else {
      console.error("Affirm SDK not loaded");
    }
    return;
  }

  affirmState.value = "loading";

  setTimeout(() => {
    affirmState.value = "idle";
    alert(
      "[Placeholder] Wire up real Affirm SDK here. See comments in QuizAffirmPrequal.vue",
    );
  }, 800);
}

// ─── Save Affirm result to backend ───────────────────────────────────────────
async function saveAffirmResult(status, limit) {
  try {
    await $fetch("/api/affirm-result", {
      method: "POST",
      body: { status, limit },
    });
  } catch (e) {
    console.error("Failed to save Affirm result", e);
  }
}

// ─── Dev Simulators ──────────────────────────────────────────────────────────
function simulateApproved() {
  approvedLimit.value = 15000;
  affirmState.value = "approved";
}
function simulateDenied() {
  affirmState.value = "denied";
}
</script>

<style scoped>
.affirm-prequal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.quiz-icon {
  font-size: 2.5rem;
}
.quiz-question {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  font-family: "Georgia", serif;
}
.quiz-sub {
  font-size: 0.95rem;
  color: #6b7280;
  font-family: "system-ui", sans-serif;
  margin: 0 0 1rem;
}

.affirm-idle {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.affirm-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #000;
  border-radius: 10px;
  color: #fff;
}
.affirm-logo {
  height: 24px;
  filter: invert(1);
  object-fit: contain;
}
.affirm-badge p {
  margin: 0;
  font-size: 0.9rem;
  font-family: "system-ui", sans-serif;
  opacity: 0.9;
}
.affirm-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.affirm-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-family: "system-ui", sans-serif;
  color: #374151;
  background: #f9fafb;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
}
.btn-affirm {
  padding: 1rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "system-ui", sans-serif;
  transition: all 0.2s;
}
.btn-affirm:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}
.btn-skip {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #9ca3af;
  cursor: pointer;
  font-family: "system-ui", sans-serif;
  text-align: center;
  padding: 0.25rem;
  transition: color 0.2s;
}
.btn-skip:hover {
  color: #374151;
}
.affirm-legal {
  font-size: 0.72rem;
  color: #9ca3af;
  line-height: 1.5;
  font-family: "system-ui", sans-serif;
  margin: 0;
}
.affirm-legal a {
  color: #6b7280;
}

.affirm-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  font-family: "system-ui", sans-serif;
  color: #6b7280;
}
.affirm-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.affirm-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
}
.result-badge {
  font-size: 3rem;
}
.affirm-result h3 {
  font-size: 1.3rem;
  margin: 0;
  font-family: "Georgia", serif;
}
.affirm-result p {
  margin: 0;
  font-family: "system-ui", sans-serif;
  color: #374151;
}
.result-sub {
  font-size: 0.85rem;
  color: #6b7280 !important;
}
.affirm-approved {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.5rem;
}
.affirm-denied {
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
}

.btn-primary {
  padding: 0.85rem 1.75rem;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "system-ui", sans-serif;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: #0f0f1a;
}

.dev-notice {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef9c3;
  border: 1.5px dashed #ca8a04;
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: "system-ui", sans-serif;
  color: #78350f;
}
.dev-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.dev-buttons button {
  padding: 0.4rem 0.75rem;
  font-size: 0.78rem;
  border: 1px solid #ca8a04;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-family: "system-ui", sans-serif;
}
@media (max-width: 500px) {
  .affirm-features {
    grid-template-columns: 1fr;
  }
}
</style>
