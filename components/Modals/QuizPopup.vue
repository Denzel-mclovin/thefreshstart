<template>
  <div class="modal">
    <div class="modal_wrapper">
      <transition name="modal-fade">
        <div class="q-modal" :style="modalStyle">
          <div class="q-modal__header">
            <span class="q-modal__title">Quiz Question</span>
            <button class="q-modal__close" @click="modalStore.closeModal()">
              ✕
            </button>
          </div>

          <div v-if="phase === 'questions'" class="q-progress-header">
            <span class="q-progress-label"
              >Question {{ stepIdx + 1 }} of {{ TOTAL_STEPS }}</span
            >
            <span class="q-progress-pct">{{ Math.round(progressPct) }}%</span>
          </div>
          <div
            v-if="phase === 'questions'"
            class="q-progress-segments"
            :style="{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)` }"
          >
            <div
              v-for="i in TOTAL_STEPS"
              :key="i"
              class="q-segment"
              :class="{ 'q-segment--filled': i <= stepIdx + 1 }"
            />
          </div>

          <div class="q-modal__body">
            <transition :name="transitionName" mode="out-in">
              <div
                v-if="phase === 'questions' && stepIdx === 0"
                key="q1"
                class="q-slide"
              >
                <div class="loader-wrapper" v-if="loaderState"><Loader /></div>
                <h2 class="q-title">{{ QUESTIONS.q1.title }}</h2>
                <p class="q-hint">
                  This is the foundation. Even if you can't, this strategy can
                  still be applied to you.
                </p>
                <div class="q-options">
                  <button
                    class="q-opt"
                    :class="{ active: a.q1 === 'yes' }"
                    @click="pick('q1', 'yes')"
                  >
                    <span class="q-opt__label">Yes</span>
                    <RadioIcon :checked="a.q1 === 'yes'" />
                  </button>
                  <button
                    class="q-opt"
                    :class="{ active: a.q1 === 'no' }"
                    @click="pick('q1', 'no')"
                  >
                    <span class="q-opt__label">No</span>
                    <RadioIcon :checked="a.q1 === 'no'" />
                  </button>
                </div>
                <div class="q-navigation">
                  <span class="q-nav-back q-nav-back--hidden">← Back</span>
                  <button
                    class="q-nav-next"
                    :class="{ 'q-nav-next--active': a.q1 !== '' }"
                    :disabled="a.q1 === ''"
                    @click="next('q1', a.q1)"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div
                v-else-if="phase === 'questions' && stepIdx === 1"
                key="q2"
                class="q-slide"
              >
                <div class="loader-wrapper" v-if="loaderState"><Loader /></div>
                <h2 class="q-title">{{ QUESTIONS.q2.title }}</h2>
                <p class="q-hint">
                  This isn't passive. You'll need to show up for weekly calls,
                  handle logistics, and make decisions. Can you commit that
                  time?
                </p>
                <div class="q-options">
                  <button
                    class="q-opt"
                    :class="{ active: a.q2 === 'yes' }"
                    @click="pick('q2', 'yes')"
                  >
                    <span class="q-opt__label">Yes</span>
                    <RadioIcon :checked="a.q2 === 'yes'" />
                  </button>
                  <button
                    class="q-opt"
                    :class="{ active: a.q2 === 'no' }"
                    @click="pick('q2', 'no')"
                  >
                    <span class="q-opt__label">No</span>
                    <RadioIcon :checked="a.q2 === 'no'" />
                  </button>
                </div>
                <div class="q-navigation">
                  <button class="q-nav-back" @click="back()">← Back</button>
                  <button
                    class="q-nav-next"
                    :class="{ 'q-nav-next--active': a.q2 !== '' }"
                    :disabled="a.q2 === ''"
                    @click="next('q2', a.q2)"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div
                v-else-if="phase === 'questions' && stepIdx === 2"
                key="q3"
                class="q-slide"
              >
                <div class="loader-wrapper" v-if="loaderState"><Loader /></div>
                <h2 class="q-title">{{ QUESTIONS.q3.title }}</h2>
                <p class="q-hint">
                  If the answer is NO (you need to consult your partner, parent,
                  or advisor), that's fine. Just make sure they attend the
                  scheduled call.
                </p>
                <div class="q-options">
                  <button
                    class="q-opt"
                    :class="{ active: a.q3 === 'yes' }"
                    @click="pick('q3', 'yes')"
                  >
                    <span class="q-opt__label">Yes</span>
                    <RadioIcon :checked="a.q3 === 'yes'" />
                  </button>
                  <button
                    class="q-opt"
                    :class="{ active: a.q3 === 'no' }"
                    @click="pick('q3', 'no')"
                  >
                    <span class="q-opt__label">No</span>
                    <RadioIcon :checked="a.q3 === 'no'" />
                  </button>
                </div>
                <div class="q-navigation">
                  <button class="q-nav-back" @click="back()">← Back</button>
                  <button
                    class="q-nav-next"
                    :class="{ 'q-nav-next--active': a.q3 !== '' }"
                    :disabled="a.q3 === ''"
                    @click="next('q3', a.q3)"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div
                v-else-if="phase === 'questions' && stepIdx === 3"
                key="q4"
                class="q-slide"
              >
                <div class="loader-wrapper" v-if="loaderState"><Loader /></div>
                <h2 class="q-title">{{ QUESTIONS.q4.title }}</h2>
                <p class="q-hint">
                  This is the real qualifier. Our consulting program is $3,000
                  for the full 90-day engagement.
                </p>
                <div
                  class="q-options"
                  :class="{ 'q-options--with-affirm': affirmVisible }"
                >
                  <div class="q-options-col">
                    <button
                      class="q-opt"
                      :class="{ active: a.q4 === 'yes' }"
                      @click="
                        pick('q4', 'yes');
                        affirmVisible = false;
                      "
                    >
                      <span class="q-opt__label"
                        >Yes — I have the cash available</span
                      >
                      <RadioIcon :checked="a.q4 === 'yes'" />
                    </button>
                    <button
                      class="q-opt"
                      :class="{ active: a.q4 === 'week' }"
                      @click="
                        pick('q4', 'week');
                        showAffirm('week');
                      "
                    >
                      <span class="q-opt__label"
                        >Maybe — I'll have it within a week</span
                      >
                      <RadioIcon :checked="a.q4 === 'week'" />
                    </button>
                    <button
                      class="q-opt"
                      :class="{ active: a.q4 === 'affirm' }"
                      @click="
                        pick('q4', 'affirm');
                        showAffirm('affirm');
                      "
                    >
                      <span class="q-opt__label"
                        >I'd use financing (Affirm)</span
                      >
                      <RadioIcon :checked="a.q4 === 'affirm'" />
                    </button>
                    <button
                      class="q-opt"
                      :class="{ active: a.q4 === 'no' }"
                      @click="
                        pick('q4', 'no');
                        showAffirm('no');
                      "
                    >
                      <span class="q-opt__label">Not right now</span>
                      <RadioIcon :checked="a.q4 === 'no'" />
                    </button>
                  </div>
                  <transition name="fade">
                    <div v-if="affirmVisible" class="q-affirm-block">
                      <div v-if="a.q4 === 'no'" class="q-affirm-pitch">
                        <p>
                          I get it, $3,000 isn't the kind of cash most people
                          have just sitting around.
                        </p>
                        <p>
                          But here's the trap most people fall into: they wait
                          for the "right time" that never quite arrives while
                          rent climbs, the dollar buys less, and the countries
                          worth moving to tighten their residency rules a little
                          more every year. Waiting is also a decision with a
                          cost. So we work with Affirm to take that decision off
                          the table. Instead of finding $3,000 up front, you
                          could put your plan in motion for as low as $97/month,
                          subject to approval, instead of "someday." Confirming
                          your eligibility takes about about a minute, or just
                          keep going and we'll cover it on the call.
                        </p>
                      </div>
                      <div v-if="a.q4 === 'week'" class="q-affirm-pitch">
                        <p>Nothing's due today. You'll lock in your call...</p>
                      </div>
                      <div v-if="a.q4 !== 'week'" class="q-affirm-widget">
                        <div class="q-affirm-widget__logo">
                          <span class="q-affirm-widget__badge">Affirm</span>
                          <span class="q-affirm-widget__tagline"
                            >Buy now, pay over time</span
                          >
                        </div>
                        <p class="q-affirm-widget__note">
                          You can confirm your Affirm eligibility below, subject
                          to approval
                        </p>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="q-navigation">
                  <button class="q-nav-back" @click="back()">← Back</button>
                  <button
                    class="q-nav-next"
                    :class="{ 'q-nav-next--active': a.q4 !== '' }"
                    :disabled="a.q4 === ''"
                    @click="next('q4', a.q4)"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div
                v-else-if="phase === 'questions' && stepIdx === 4"
                key="q5"
                class="q-slide"
              >
                <div class="loader-wrapper" v-if="loaderState"><Loader /></div>
                <h2 class="q-title">{{ QUESTIONS.q5.title }}</h2>
                <p class="q-hint">
                  Pick the one that resonates most — this helps us send you the
                  most relevant info.
                </p>
                <div class="q-options">
                  <button
                    v-for="opt in q5Options"
                    :key="opt.value"
                    class="q-opt"
                    :class="{ active: a.q5 === opt.value }"
                    @click="pick('q5', opt.value)"
                  >
                    <span class="q-opt__label">
                      <span class="q-opt__emoji">{{ opt.emoji }}</span>
                      {{ opt.label }}
                    </span>
                    <RadioIcon :checked="a.q5 === opt.value" />
                  </button>
                </div>
                <div class="q-navigation">
                  <button class="q-nav-back" @click="back()">← Back</button>
                  <button
                    class="q-nav-next"
                    :class="{ 'q-nav-next--active': a.q5 !== '' }"
                    :disabled="a.q5 === ''"
                    @click="finishQuiz()"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div v-if="phase === 'results'" key="results" class="q-slide">
                <div class="q-slide-results">
                  <button
                    class="go-back-btn"
                    @click="
                      phase = 'questions';
                      stepIdx = 4;
                      transitionName = 'slide-down';
                    "
                  >
                    ← Back
                  </button>

                  <div class="results-content">
                    <div class="results-content-label">
                      <svg
                        viewBox="0 0 27 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9.33333L9.33333 17.6667L26 1"
                          stroke="#F9F9F9"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>

                    <div class="result-content-text-wrap">
                      <h2 class="results-content-heading">
                        You Qualify
                        <br />
                        Here's the shape of your situation.
                      </h2>

                      <p class="results-content-info">
                        {{ resultsSummary }}
                      </p>
                    </div>
                  </div>

                  <div class="button-group">
                    <button class="q-btn-primary" @click="goToCalendlyDirect()">
                      Book My Free Strategy Call →
                    </button>
                    <button class="q-btn-secondary" @click="phase = 'contact'">
                      Email me my full breakdown first
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div v-if="phase === 'contact'" key="contact" class="q-slide">
                <div class="q-results-preview">
                  <span class="q-results-preview__icon">📋</span>
                  <div>
                    <p class="q-results-preview__label">
                      Your full breakdown is ready
                    </p>
                    <p class="q-results-preview__sub">
                      Enter your details and we'll send it straight to your
                      inbox.
                    </p>
                  </div>
                </div>
                <div class="q-form">
                  <div class="q-field">
                    <label>First Name *</label>
                    <input
                      v-model="contact.firstName"
                      type="text"
                      placeholder="Jane"
                    />
                  </div>
                  <div class="q-field">
                    <label>Last Name *</label>
                    <input
                      v-model="contact.lastName"
                      type="text"
                      placeholder="Smith"
                    />
                  </div>
                  <div class="q-field">
                    <label>Phone Number *</label>
                    <input
                      v-model="contact.phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  <div class="q-field">
                    <label>Email Address *</label>
                    <input
                      v-model="contact.email"
                      type="email"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div class="q-consent">
                    <label class="q-consent__item">
                      <input type="checkbox" v-model="consent.email" />
                      <span
                        >I agree to receive email updates and marketing.</span
                      >
                    </label>
                    <label class="q-consent__item">
                      <input type="checkbox" v-model="consent.sms" />
                      <span
                        >I agree to receive SMS/text messages. Reply STOP to
                        unsubscribe.</span
                      >
                    </label>
                  </div>
                  <transition name="fade">
                    <p v-if="contactError" class="q-inline-error">
                      {{ contactError }}
                    </p>
                  </transition>
                  <button
                    class="q-btn-primary"
                    @click="submitContact"
                    :disabled="submitting"
                  >
                    <span v-if="submitting" class="q-spinner" />
                    <span v-else>Send My Breakdown & Book →</span>
                  </button>
                </div>
                <button
                  class="q-nav-back"
                  style="margin-top: 16px"
                  @click="phase = 'results'"
                >
                  ← Back
                </button>
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div v-if="phase === 'homerun'" key="homerun" class="q-slide">
                <h2 class="q-title">
                  What would make this a homerun in 90 days?
                </h2>
                <p class="q-hint">
                  Be as specific as you'd like — this helps us prepare for your
                  call.
                </p>
                <textarea
                  v-model="a.homerun"
                  class="q-textarea"
                  :maxlength="HOMERUN_MAX"
                  placeholder="e.g. Replace my 9-5 income, spend more time with family, travel freely…"
                  rows="4"
                />
                <div
                  class="q-char-count"
                  :class="{ warning: a.homerun.length > HOMERUN_MAX - 60 }"
                >
                  {{ a.homerun.length }} / {{ HOMERUN_MAX }}
                </div>
                <button
                  class="q-btn-primary"
                  :disabled="!a.homerun.trim()"
                  @click="goToCalendly()"
                  style="margin-top: 16px"
                >
                  Book My Session →
                </button>
                <button
                  class="q-nav-back"
                  style="margin-top: 12px"
                  @click="phase = 'contact'"
                >
                  ← Back
                </button>
              </div>
            </transition>

            <div
              v-show="phase === 'calendly'"
              :class="[
                'q-slide',
                'q-slide--calendly',
                { active: phase === 'calendly' },
              ]"
            >
              <h2 class="q-title">Book your free strategy session</h2>
              <div class="calendly-inline-widget">
                <iframe
                  @load="calendlyLoaded = true"
                  :src="calendlyUrl"
                  width="100%"
                  height="700"
                  frameborder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  defineComponent,
  h,
} from "vue";
import Loader from "../shared/Loader.vue";

// STORES

import { useModalStore } from "../../stores/modal";

// DEFINE STORE --------------------------
const modalStore = useModalStore();

const RadioIcon = defineComponent({
  props: { checked: Boolean },
  setup(props) {
    return () =>
      h(
        "span",
        { class: ["q-opt__radio", props.checked ? "checked" : ""] },
        props.checked
          ? h(
              "svg",
              {
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
              },
              [
                h("circle", {
                  cx: "10",
                  cy: "10",
                  r: "10",
                  fill: "var(--dark-green)",
                }),
                h("path", {
                  d: "M5.5 10.5L8.5 13.5L14.5 7.5",
                  stroke: "white",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                }),
              ],
            )
          : null,
      );
  },
});

// ─── Props / Emits ─────────────────────────────────────────────────────────
const props = defineProps({ modelValue: { type: Boolean, default: true } });
const emit = defineEmits(["update:modelValue"]);

// ─── Config ────────────────────────────────────────────────────────────────
const CALENDLY_URL = "https://calendly.com/mysty-vis/strategy_session";
const TOTAL_STEPS = 5;
const HOMERUN_MAX = 500;

const QUESTIONS = {
  q1: { id: 1, title: "Can You Work Remotely at your Current Job?" },
  q2: {
    id: 2,
    title: "Could you commit 4–6 hours weekly for the next 90 days?",
  },
  q3: { id: 3, title: "Can you make investment decisions independently?" },
  q4: {
    id: 4,
    title: "Are you prepared to invest $3,000 in the next 14 days?",
  },
  q5: {
    id: 5,
    title: "What's your biggest hesitation about relocating abroad?",
  },
};

const q5Options = [
  { value: "health", label: "Health & Healthcare", emoji: "🏥" },
  { value: "lifestyle", label: "Lifestyle & Culture", emoji: "🌴" },
  { value: "dating", label: "Dating & Relationships", emoji: "💛" },
  { value: "finances", label: "Finances & Cost", emoji: "💰" },
  { value: "family", label: "Family & Relationships", emoji: "👨‍👩‍👧" },
];

const concernLabels = {
  health: "health & healthcare",
  lifestyle: "lifestyle & culture",
  dating: "dating & relationships",
  finances: "finances & cost of living",
  family: "family & relationships",
};

const teamMemberName = ref("Vito");

// ─── State ─────────────────────────────────────────────────────────────────
const phase = ref("questions");
// const phase = ref("confirmed");

const stepIdx = ref(0);
const transitionName = ref("slide-up");
const submitting = ref(false);
const contactError = ref("");
const quizSession = ref(null);
const loaderState = ref(false);
const embedDomain = ref("");
const affirmVisible = ref(false);
const affirmStatus = ref("idle"); // idle | loading | approved | denied

const a = ref({ q1: "", q2: "", q3: "", q4: "", q5: "", homerun: "" });
const contact = ref({ firstName: "", lastName: "", phone: "", email: "" });
const consent = ref({ email: false, sms: false });

// ─── Computed ──────────────────────────────────────────────────────────────
const progressPct = computed(() => (stepIdx.value / TOTAL_STEPS) * 100);

const openers = {
  "yes-yes":
    "You're remote-capable and ready to commit so the hard prerequisites are already in place.",
  "no-yes":
    "You've got the time to commit, and the one piece to sort is the remote-income side which is something we help people build, this isn't a dealbreaker.",
  "yes-no":
    "You're already remote-capable, and we'll work around a tight schedule. Most of this is built to fit into a few focused hours.",
  "no-no":
    "You're early in the setup. No remote income yet and not much spare time, but that's workable. It just means we start by building the foundation.",
};

const concernHooks = {
  finances:
    "What you care about most is making the money actually work, and that's the part we go deepest on: there's a specific way to make your income stretch from the day you land.",
  health:
    "What you care about most is health & healthcare, and that one has clearer, better answers than most people expect, and it's one of the first things we map.",
  lifestyle:
    "What you care about most is lifestyle & culture, and that's where this stops being centered around math and starts being about the life you actually want. And the right place changes everything.",
  dating:
    "What you care about most is dating & relationships, and that side is real and solvable, and where you land affects it more than most people realize.",
  family:
    "What you care about most is family & relationships, and that doesn't have to reshape the whole plan. Moving abroad with a family is far from impossible, and we show you how to succeed together.",
};

const resultsSummary = computed(() => {
  const openerKey = `${a.value.q1 === "yes" ? "yes" : "no"}-${a.value.q2 === "yes" ? "yes" : "no"}`;
  const opener = openers[openerKey];
  const concernHook =
    concernHooks[a.value.q5] ??
    "and that's exactly what we'll help you map out.";

  return `${opener} ${concernHook}\n\n That's exactly what the strategy session is for. To turn this into your specific plan: which country, what it actually costs you, and how fast.`;
});

const calendlyUrl = computed(() => {
  const p = new URLSearchParams({
    name: `${contact.value.firstName} ${contact.value.lastName}`.trim(),
    email: contact.value.email,
    a1: contact.value.phone,
    hide_gdpr_banner: "1",
    embed_domain: embedDomain.value,
    embed_type: "Inline",
  });
  return `${CALENDLY_URL}?${p.toString()}`;
});

// ─── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  document.body.style.overflow = "hidden";
  embedDomain.value = window.location.hostname;
  window.addEventListener("message", handleCalendlyMessage);
  loadCalendlyScript();
});
onBeforeUnmount(() => {
  document.body.style.overflow = "unset";
  window.removeEventListener("message", handleCalendlyMessage);
});

// ─── Navigation ────────────────────────────────────────────────────────────
function pick(field, value) {
  a.value[field] = value;
}

async function next(field, value) {
  if (!value) return;
  updateQuiz(field, value).catch(console.error);
  transitionName.value = "slide-up";
  if (stepIdx.value < TOTAL_STEPS - 1) {
    setTimeout(() => {
      stepIdx.value++;
    }, 180);
  }
}

function back() {
  transitionName.value = "slide-down";
  if (stepIdx.value > 0) stepIdx.value--;
}

async function finishQuiz() {
  if (!a.value.q5) return;

  await next("q5", a.value.q5);

  phase.value = "results";
}

function showAffirm() {
  affirmVisible.value = true;
  affirmStatus.value = "idle";
  nextTick(() => {
    document
      .querySelector(".q-affirm-block")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function simulateAffirm() {
  affirmStatus.value = "loading";
  setTimeout(() => {
    affirmStatus.value = "approved";
  }, 1800);
}

async function goToResults() {
  transitionName.value = "slide-up";

  await new Promise((resolve) => setTimeout(resolve, 280));

  phase.value = "results";
}

function goToCalendlyDirect() {
  phase.value = "calendly";
  nextTick(initCalendly);
}
function goToCalendly() {
  phase.value = "calendly";
  nextTick(initCalendly);
  createLead();
}

// ─── API ───────────────────────────────────────────────────────────────────
async function updateQuiz(field, value) {
  const q = QUESTIONS[field];
  loaderState.value = true;
  try {
    const result = await $fetch("/api/quiz", {
      method: "POST",
      body: {
        sessionId: quizSession.value,
        questionId: q.id,
        question: q.title,
        answer: value,
      },
    });
    if (!quizSession.value && result.sessionId) {
      quizSession.value = result.sessionId;
      document.cookie = `quiz_session=${quizSession.value}; path=/; max-age=31536000`;
      await sendUtm();
    }
    return result;
  } finally {
    loaderState.value = false;
  }
}

async function sendUtm() {
  const utmRaw = sessionStorage.getItem("utm_attribution");

  if (!utmRaw) return;

  const utm = JSON.parse(utmRaw);

  await $fetch("/api/lead/utm", {
    method: "POST",
    body: {
      sessionId: quizSession.value,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
      utmTerm: utm.utm_term,
      utmContent: utm.utm_content,
    },
  });
}

async function createLead() {
  try {
    await $fetch("/api/lead/create", {
      method: "POST",
      body: {
        firstName: contact.value.firstName,
        lastName: contact.value.lastName,
        phoneNumber: contact.value.phone,
        userEmail: contact.value.email,
        sessionId: quizSession.value,
        quizComment: a.value.homerun,
        consentEmail: consent.value.email,
        consentSms: consent.value.sms,
      },
    });
  } catch (err) {
    console.error("Lead save failed:", err);
  }
}

async function submitContact() {
  contactError.value = "";
  const { firstName, lastName, phone, email } = contact.value;
  if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
    contactError.value = "Please fill in all fields to continue.";
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    contactError.value = "Please enter a valid email address.";
    return;
  }
  submitting.value = true;
  phase.value = "homerun";
  submitting.value = false;
}

// ─── Calendly ──────────────────────────────────────────────────────────────
function loadCalendlyScript() {
  if (document.querySelector('script[src*="calendly.com/assets"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://assets.calendly.com/assets/external/widget.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.head.appendChild(script);
}

async function handleCalendlyMessage(e) {
  if (e.origin !== "https://calendly.com") return;

  if (e.data?.event === "calendly.event_scheduled") {
    await $fetch("/api/calendly/invite", {
      method: "POST",
      body: {
        inviteeUri: e.data.payload.invitee.uri,
        eventUri: e.data.payload.event.uri,
        sessionId: quizSession.value,
      },
    });
  }
  if (e.data?.event === "calendly.event_scheduled") {
    setTimeout(() => {
      // phase.value = "confirmed";

      navigateTo("/confirmation");
    }, 1800);
  }
}

function initCalendly() {
  if (window.Calendly) window.Calendly.initInlineWidgets();
}

const modalStyle = computed(() => ({
  width:
    phase.value === "calendly"
      ? "clamp(300px, 90vw, 1100px)"
      : "clamp(300px, 90vw, 700px)",

  maxWidth: phase.value === "calendly" ? "1100px" : "700px",

  height: phase.value === "calendly" ? "90vh" : "auto",
}));
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.modal {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.modal_wrapper {
  pointer-events: all;
}

.q-modal {
  background: #ffffff;
  border-radius: var(--radius-medium);
  width: clamp(300px, 90vw, 700px);
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);

  @media (max-width: 480px) {
    max-height: 96vh;
    border-radius: var(--radius-small);

    width: clamp(280px, 95vw, 700px);
  }
}

.q-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 30px 0;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    padding: 25px 25px 0;
  }

  @media screen and (max-width: 480px) {
    padding: 20px 20px 0;
  }
}

.q-modal__title {
  @include mixins.fz-h5;
  color: var(--dark-green);
  font-size: 16px;
}

.q-modal__close {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  color: var(--dark-green);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease 0.3s;
  flex-shrink: 0;

  &:hover {
    background: var(--dark-green);
    transition: all ease 0.3s;
    color: var(--soft-white);
  }
}

.q-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 15px;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    padding: 20px 25px 15px;
  }

  @media screen and (max-width: 480px) {
    padding: 20px 20px 15px;
  }
}

.q-progress-label,
.q-progress-pct {
  @include mixins.caption-font($color: var(--dark-green));
  font-weight: 500;
}

.q-progress-segments {
  display: grid;
  gap: 6px;
  padding: 0 30px;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    padding: 0 25px;
  }

  @media screen and (max-width: 480px) {
    padding: 0 20px;
  }
}

.q-segment {
  height: 8px;
  border-radius: 100px;
  background: var(--light-grey);
  transition: background 0.35s ease;

  &--filled {
    background: var(--dark-green);
  }
}

.q-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 30px 30px;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray-2);
    border-radius: 4px;
  }

  @media screen and (max-width: 768px) {
    padding: 25px 25px 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px 20px;
  }
}

.q-slide {
  display: flex;
  flex-direction: column;
}

.loader-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(3px);
  border-radius: var(--radius-small);
  z-index: 10;
}

.q-title {
  @include mixins.fz-h3($color: var(--dark-green));
  font-weight: 500;
  margin: 0 0 10px;
}

.q-hint {
  @include mixins.fz-body($color: var(--gray-6));
  margin: 0 0 28px;
}

.q-options {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &--with-affirm {
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
}

.q-options-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.q-opt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 26px;
  background: #ffffff;
  border: 1.5px solid var(--gray-2);
  border-radius: var(--radius-small);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.18s ease,
    background 0.18s ease;

  &:hover {
    border-color: var(--dark-green);
    background: rgba(0, 51, 35, 0.03);
  }

  &.active {
    border-color: var(--dark-green);
    background: rgba(0, 51, 35, 0.04);
  }
}

.q-opt__label {
  @include mixins.fz-body;
  font-size: 15px;
  font-weight: 500;
  color: var(--dark-green);
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.q-opt__emoji {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

:deep(.q-opt__radio) {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--gray-2);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.18s;
  background: #ffffff;

  svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  &.checked {
    border-color: transparent;
  }
}

.q-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 32px;
}

.q-nav-back {
  background: none;
  border: 1.5px solid var(--gray-2);
  border-radius: 10px;
  @include mixins.fz-body($color: var(--dark-green));
  padding: 10px 20px;
  cursor: pointer;
  transition:
    border-color 0.18s,
    background 0.18s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--light-grey);
  }

  &--hidden {
    visibility: hidden;
    pointer-events: none;
  }
}

.q-nav-next {
  background: var(--gray-3);
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  @include mixins.fz-body($color: #ffffff);
  font-weight: 600;
  cursor: not-allowed;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &--active,
  &:not(:disabled) {
    background: var(--dark-green);
    cursor: pointer;

    &:hover {
      background: var(--primary-btn-hover, #004c34);
      transform: translateY(-1px);
    }
  }

  &:disabled {
    background: var(--gray-3);
    cursor: not-allowed;
  }
}

.q-affirm-block {
  flex: 1;
  border: 1.5px solid var(--gray-2);
  border-radius: var(--radius-small);
  overflow: hidden;
  min-width: 0;
}

.q-affirm-pitch {
  padding: 16px 18px;
  background: rgba(0, 51, 35, 0.03);
  border-bottom: 1px solid var(--gray-2);
  font-size: 13px;
  color: var(--dark-green);
  line-height: 1.7;

  p {
    margin: 0 0 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  strong {
    font-weight: 700;
  }
}

.q-affirm-widget {
  padding: 16px 18px;
  background: var(--light-grey);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.q-affirm-widget__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.q-affirm-widget__badge {
  background: var(--soft-white);
  color: var(--dark-green);
  font-weight: 800;
  font-size: 13px;
  padding: 3px 8px;
  border-radius: 4px;
}

.q-affirm-widget__tagline,
.q-affirm-widget__note {
  @include mixins.caption-font;
  font-size: 12px;
  color: var(--gray-6);
  margin: 0;
}

.q-btn-affirm {
  @include mixins.button-primary(#4c6ef5);
  color: #fff;
  border-radius: var(--radius-small);
  font-size: 13px;
  padding: 9px 16px;

  &:hover {
    background-color: #6484f7 !important;
  }
}

.q-affirm-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--gray-5);
}

.q-affirm-result {
  font-size: 13px;
  line-height: 1.6;
  &--ok {
    color: #1a7f4b;
  }
  &--denied {
    color: #d93535;
  }
}

.q-cal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 221, 120, 0.1);
  border: 1px solid rgba(0, 221, 120, 0.3);
  color: #0d7a45;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 14px;
}

.q-slide-results {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  gap: 30px;

  .go-back-btn {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .results-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    gap: 20px;

    &-label {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--surface-green);
      border-radius: 50%;
      position: relative;

      svg {
        width: 75%;
        height: 75%;
        background: var(--dark-green);
        aspect-ratio: 1/1;
        padding: 20px;
        border-radius: 50%;
      }
    }

    &-text-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    &-heading {
      @include mixins.fz-h3($color: var(--dark-green));
      font-weight: 500;
      text-align: center;
    }

    &-info {
      @include mixins.fz-body;
      color: var(--gray-6);
      line-height: 1.7;
    }
  }

  .button-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex: 1;
    position: relative;
    width: 100%;
    height: auto;
  }
}

.confirmed-label {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--surface-green);
  border-radius: 50%;
  position: relative;
  margin: 0 auto 20px;

  svg {
    width: 75%;
    height: 75%;
    background: var(--dark-green);
    aspect-ratio: 1/1;
    padding: 20px;
    border-radius: 50%;
  }
}

.q-results-body {
  @include mixins.fz-body;
  color: var(--gray-5);
  line-height: 1.7;
  margin: 8px 0 20px;
}

.q-results-fork {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.q-btn-primary {
  @include mixins.button-primary;
  border-radius: var(--radius-small);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 22px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: var(--primary-btn-hover, #004c34) !important;
  }
}

.q-btn-secondary {
  @include mixins.button-outline;
  border-radius: var(--radius-small);
  color: var(--gray-6);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 20px;
  width: 100%;
  text-align: center;
  transition: all ease 0.3s;
  display: block;

  @media screen and (min-width: 1024px) {
    &:hover {
      color: var(--dark-green);
      transition: all ease 0.3s;
    }
  }
}

.q-results-preview {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(0, 221, 120, 0.06);
  border: 1px solid rgba(0, 221, 120, 0.22);
  border-radius: var(--radius-small);
  margin-bottom: 20px;
}

.q-results-preview__icon {
  font-size: 26px;
  flex-shrink: 0;
}
.q-results-preview__label {
  @include mixins.fz-h6;
  font-size: 14px;
  color: var(--dark-green);
  margin: 0 0 4px;
}
.q-results-preview__sub {
  @include mixins.caption-font;
  font-size: 13px;
  color: var(--gray-5);
  margin: 0;
}

.q-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.q-field {
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    @include mixins.caption-font;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gray-5);
  }

  input {
    @include mixins.fz-body;
    font-size: 14px;
    background: #ffffff;
    border: 1.5px solid var(--gray-2);
    border-radius: var(--radius-small);
    color: var(--dark-green);
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.18s;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: var(--dark-green);
    }
    &::placeholder {
      color: var(--gray-4);
    }
  }
}

.q-consent {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: var(--soft-white);
  border: 1px solid var(--gray-2);
  border-radius: var(--radius-small);
}

.q-consent__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gray-5);
  line-height: 1.5;

  input[type="checkbox"] {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--dark-green);
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
}

.q-inline-error {
  font-size: 13px;
  color: #d93535;
  margin: 0;
  padding: 9px 12px;
  background: rgba(217, 53, 53, 0.07);
  border-radius: 8px;
  border: 1px solid rgba(217, 53, 53, 0.18);
}

.q-textarea {
  @include mixins.fz-body;
  font-size: 14px;
  width: 100%;
  background: #ffffff;
  border: 1.5px solid var(--gray-2);
  border-radius: var(--radius-small);
  color: var(--dark-green);
  padding: 12px 14px;
  resize: vertical;
  outline: none;
  transition: border-color 0.18s;
  box-sizing: border-box;

  &:focus {
    border-color: var(--dark-green);
  }
  &::placeholder {
    color: var(--gray-4);
  }
}

.q-char-count {
  @include mixins.caption-font;
  font-size: 12px;
  color: var(--gray-5);
  text-align: right;
  margin-top: 4px;
  transition: color 0.2s;

  &.warning {
    color: var(--dark-green);
  }
}

.q-slide--calendly {
  .q-title,
  .q-hint {
    text-align: center;
  }
}

.calendly-inline-widget {
  width: 100%;
  border-radius: var(--radius-small);
  border: 1.5px solid var(--gray-2);
  min-height: 60vh;

  iframe {
    min-height: inherit;
  }
}

.q-confirmed-video {
  width: 100%;
  aspect-ratio: 16/9;
  max-width: 520px;
  background: var(--light-grey);
  border-radius: var(--radius-small);
  border: 1.5px solid var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
}

.q-play {
  color: var(--dark-green);
  font-size: 22px;
  opacity: 0.5;
}

.q-confirmed-steps {
  @include mixins.fz-body;
  font-size: 14px;
  padding-left: 18px;
  color: var(--gray-5);
  line-height: 1.7;
  margin: 12px 0;

  strong {
    color: var(--dark-green);
  }
}

.q-spinner {
  width: 15px;
  height: 15px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-18px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(18px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
