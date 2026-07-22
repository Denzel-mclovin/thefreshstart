<template>
  <div class="seller-dashboard">
    <!-- HEADER -->
    <header class="sd-header">
      <div class="sd-header__logo">
        <span class="sd-header__dot"></span>
        <span>CRM · Продавец</span>
      </div>
      <div class="sd-header__seller">
        <span class="sd-header__avatar">{{ sellerInitials }}</span>
        <span>{{ currentSeller?.name }} {{ currentSeller?.surname }}</span>
      </div>
    </header>

    <main class="sd-main">
      <!-- TABS -->
      <nav class="sd-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="sd-tabs__btn"
          :class="{ 'sd-tabs__btn--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="sd-tabs__icon">{{ tab.icon }}</span>
          {{ tab.label }}
          <span v-if="tab.count" class="sd-tabs__badge">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- ═══ TAB: ОБЩИЙ ПУУЛ ═══ -->
      <section v-if="activeTab === 'pool'" class="sd-section">
        <div class="sd-section__head">
          <h2 class="sd-section__title">Свободные лиды</h2>
          <p class="sd-section__sub">Пользователи, прошедшие квиз и не закреплённые за продавцом</p>
        </div>

        <div v-if="loadingPool" class="sd-loading">
          <span class="sd-spinner"></span> Загрузка...
        </div>

        <div v-else-if="poolLeads.length === 0" class="sd-empty">
          <span>🎉</span>
          <p>Свободных лидов нет</p>
        </div>

        <div v-else class="sd-table-wrap">
          <table class="sd-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Источник</th>
                <th>Дата</th>
                <th>Прогресс</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in poolLeads" :key="lead.id" class="sd-table__row">
                <td class="sd-table__name">
                  {{ lead.firstName || '—' }} {{ lead.lastName || '' }}
                </td>
                <td>{{ lead.phone || '—' }}</td>
                <td>{{ lead.email || '—' }}</td>
                <td>
                  <span class="sd-tag sd-tag--source">{{ lead.utmSource || 'direct' }}</span>
                </td>
                <td class="sd-table__date">{{ formatDate(lead.createdAt) }}</td>
                <td>
                  <div class="sd-progress">
                    <div
                      class="sd-progress__bar"
                      :style="{ width: ((lead.answers?.length || 0) / 5 * 100) + '%' }"
                    ></div>
                    <span>{{ lead.answers?.length || 0 }}/5</span>
                  </div>
                </td>
                <td>
                  <button
                    class="sd-btn sd-btn--take"
                    :disabled="takingId === lead.id"
                    @click="takeLead(lead)"
                  >
                    {{ takingId === lead.id ? '...' : 'Взять' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ═══ TAB: МОИ ЛИДЫ ═══ -->
      <section v-if="activeTab === 'my'" class="sd-section">
        <div class="sd-section__head">
          <h2 class="sd-section__title">Мои лиды</h2>
          <p class="sd-section__sub">Пользователи, закреплённые за вами</p>
        </div>

        <div v-if="loadingMy" class="sd-loading">
          <span class="sd-spinner"></span> Загрузка...
        </div>

        <div v-else-if="myLeads.length === 0" class="sd-empty">
          <span>📋</span>
          <p>У вас пока нет закреплённых лидов</p>
        </div>

        <div v-else class="sd-cards">
          <div
            v-for="lead in myLeads"
            :key="lead.id"
            class="sd-card"
            @click="openLead(lead)"
          >
            <div class="sd-card__top">
              <div class="sd-card__avatar">
                {{ getInitials(lead.firstName, lead.lastName) }}
              </div>
              <div class="sd-card__info">
                <div class="sd-card__name">
                  {{ lead.firstName || 'Без имени' }} {{ lead.lastName || '' }}
                </div>
                <div class="sd-card__meta">{{ lead.phone || lead.email || '—' }}</div>
              </div>
              <span
                class="sd-badge"
                :class="`sd-badge--${lead.status.toLowerCase()}`"
              >
                {{ statusLabel(lead.status) }}
              </span>
            </div>

            <div class="sd-card__progress">
              <div class="sd-progress">
                <div
                  class="sd-progress__bar"
                  :style="{ width: ((lead.answers?.length || 0) / 5 * 100) + '%' }"
                ></div>
                <span>{{ lead.answers?.length || 0 }}/5 ответов</span>
              </div>
            </div>

            <div class="sd-card__footer">
              <span class="sd-tag sd-tag--source">{{ lead.utmSource || 'direct' }}</span>
              <span class="sd-card__date">{{ formatDate(lead.createdAt) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ TAB: АНАЛИТИКА ═══ -->
      <section v-if="activeTab === 'analytics'" class="sd-section">
        <div class="sd-section__head">
          <h2 class="sd-section__title">Аналитика квиза</h2>
          <p class="sd-section__sub">Общая статистика прохождения</p>
        </div>

        <div v-if="loadingAnalytics" class="sd-loading">
          <span class="sd-spinner"></span> Загрузка...
        </div>

        <div v-else class="sd-analytics">
          <!-- Карточки-метрики -->
          <div class="sd-metrics">
            <div class="sd-metric">
              <div class="sd-metric__value">{{ analytics?.total || 0 }}</div>
              <div class="sd-metric__label">Всего лидов</div>
            </div>
            <div class="sd-metric sd-metric--green">
              <div class="sd-metric__value">{{ analytics?.completed || 0 }}</div>
              <div class="sd-metric__label">Завершили квиз</div>
            </div>
            <div class="sd-metric sd-metric--red">
              <div class="sd-metric__value">{{ analytics?.abandoned || 0 }}</div>
              <div class="sd-metric__label">Покинули квиз</div>
            </div>
            <div class="sd-metric sd-metric--yellow">
              <div class="sd-metric__value">{{ analytics?.unassigned || 0 }}</div>
              <div class="sd-metric__label">Без продавца</div>
            </div>
          </div>

          <!-- Воронка: на каком шаге уходят -->
          <div class="sd-chart-block">
            <h3 class="sd-chart-title">Дропаут по шагам квиза</h3>
            <div class="sd-funnel">
              <div
                v-for="step in 5"
                :key="step"
                class="sd-funnel__row"
              >
                <div class="sd-funnel__label">Шаг {{ step }}</div>
                <div class="sd-funnel__track">
                  <div
                    class="sd-funnel__fill"
                    :style="{ width: funnelWidth(step) }"
                  ></div>
                </div>
                <div class="sd-funnel__count">
                  {{ analytics?.dropoffByStep?.[step] || 0 }} чел.
                </div>
              </div>
            </div>
          </div>

          <!-- Завершили vs Ушли — круговая диаграмма SVG -->
          <div class="sd-chart-block">
            <h3 class="sd-chart-title">Завершаемость квиза</h3>
            <div class="sd-donut-wrap">
              <svg class="sd-donut" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="60" cy="60" r="48"
                  fill="none" stroke="var(--clr-abandoned)" stroke-width="14"
                />
                <circle
                  cx="60" cy="60" r="48"
                  fill="none"
                  stroke="var(--clr-completed)"
                  stroke-width="14"
                  stroke-dasharray="301.59"
                  :stroke-dashoffset="donutOffset"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="56" text-anchor="middle" class="sd-donut__pct">
                  {{ completionRate }}%
                </text>
                <text x="60" y="70" text-anchor="middle" class="sd-donut__sub">
                  завершили
                </text>
              </svg>
              <div class="sd-donut__legend">
                <div class="sd-donut__item">
                  <span class="sd-donut__dot" style="background: var(--clr-completed)"></span>
                  Завершили ({{ analytics?.completed || 0 }})
                </div>
                <div class="sd-donut__item">
                  <span class="sd-donut__dot" style="background: var(--clr-abandoned)"></span>
                  Покинули ({{ analytics?.abandoned || 0 }})
                </div>
                <div class="sd-donut__item">
                  <span class="sd-donut__dot" style="background: var(--clr-progress)"></span>
                  В процессе ({{ analytics?.inProgress || 0 }})
                </div>
              </div>
            </div>
          </div>

          <!-- UTM источники -->
          <div class="sd-chart-block">
            <h3 class="sd-chart-title">Источники трафика (UTM)</h3>
            <div class="sd-bar-chart">
              <div
                v-for="(count, source) in analytics?.utmSources"
                :key="source"
                class="sd-bar-chart__row"
              >
                <div class="sd-bar-chart__label">{{ source }}</div>
                <div class="sd-bar-chart__track">
                  <div
                    class="sd-bar-chart__fill"
                    :style="{ width: utmWidth(count) }"
                  ></div>
                </div>
                <div class="sd-bar-chart__count">{{ count }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ═══ POPUP: Детали лида ═══ -->
    <Teleport to="body">
      <div v-if="selectedLead" class="sd-overlay" @click.self="closeLead">
        <div class="sd-popup">
          <button class="sd-popup__close" @click="closeLead">✕</button>

          <div class="sd-popup__header">
            <div class="sd-popup__avatar">
              {{ getInitials(selectedLead.firstName, selectedLead.lastName) }}
            </div>
            <div>
              <h2 class="sd-popup__name">
                {{ selectedLead.firstName || 'Без имени' }} {{ selectedLead.lastName || '' }}
              </h2>
              <span class="sd-badge" :class="`sd-badge--${selectedLead.status.toLowerCase()}`">
                {{ statusLabel(selectedLead.status) }}
              </span>
            </div>
          </div>

          <div class="sd-popup__grid">
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">📞 Телефон</div>
              <div class="sd-popup__field-val">{{ selectedLead.phone || '—' }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">✉️ Email</div>
              <div class="sd-popup__field-val">{{ selectedLead.email || '—' }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">📅 Зарегистрирован</div>
              <div class="sd-popup__field-val">{{ formatDate(selectedLead.createdAt) }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">📍 Источник</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmSource || 'direct' }}</div>
            </div>
            <div v-if="selectedLead.utmCampaign" class="sd-popup__field">
              <div class="sd-popup__field-label">🎯 Кампания</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmCampaign }}</div>
            </div>
            <div v-if="selectedLead.utmMedium" class="sd-popup__field">
              <div class="sd-popup__field-label">📢 Медиум</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmMedium }}</div>
            </div>
          </div>

          <!-- Ответы на квиз -->
          <div class="sd-popup__answers">
            <h3 class="sd-popup__answers-title">Ответы на квиз</h3>
            <div
              v-if="!selectedLead.answers || selectedLead.answers.length === 0"
              class="sd-empty"
            >
              <span>❓</span><p>Ответов нет</p>
            </div>
            <div
              v-else
              v-for="ans in selectedLead.answers"
              :key="ans.id"
              class="sd-answer"
            >
              <div class="sd-answer__q">
                <span class="sd-answer__num">{{ ans.questionId }}</span>
                {{ ans.question }}
              </div>
              <div class="sd-answer__a">{{ ans.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>

const props = defineProps();

// ── State ──────────────────────────────────────────────
const activeTab = ref<'pool' | 'my' | 'analytics'>('pool')
const selectedLead = ref<any>(null)
const takingId = ref<string | null>(null)

const poolLeads = ref([])
const myLeads = ref([])
const analytics = ref(null)
const currentSeller = ref(null)

const loadingPool = ref(false)
const loadingMy = ref(false)
const loadingAnalytics = ref(false)

// ── Tabs ───────────────────────────────────────────────
const tabs = computed(() => [
  { id: 'pool', label: 'Свободные лиды', icon: '🎯', count: poolLeads.value.length },
  { id: 'my', label: 'Мои лиды', icon: '👤', count: myLeads.value.length },
  { id: 'analytics', label: 'Аналитика', icon: '📊', count: null },
])

// ── Computed helpers ────────────────────────────────────
const sellerInitials = computed(() => {
  if (!currentSeller.value) return '?'
  return (currentSeller.value.name?.[0] || '') + (currentSeller.value.surname?.[0] || '')
})

const completionRate = computed(() => {
  const total = analytics.value?.total || 0
  const completed = analytics.value?.completed || 0
  if (!total) return 0
  return Math.round((completed / total) * 100)
})

const donutOffset = computed(() => {
  const circumference = 301.59
  return circumference - (completionRate.value / 100) * circumference
})

// ── Fetch ───────────────────────────────────────────────
async function fetchPool() {
  loadingPool.value = true
  try {
    poolLeads.value = await $fetch('/api/leads?unassigned=true')
  } finally {
    loadingPool.value = false
  }
}

async function fetchMyLeads() {
  loadingMy.value = true
  try {
    myLeads.value = await $fetch(`/api/leads?sellerId=${props.sellerId}`)
  } finally {
    loadingMy.value = false
  }
}

async function fetchAnalytics() {
  loadingAnalytics.value = true
  try {
    analytics.value = await $fetch('/api/analytics')
  } finally {
    loadingAnalytics.value = false
  }
}

// ── Actions ─────────────────────────────────────────────
async function takeLead(lead) {
  takingId.value = lead.id
  try {
    await $fetch(`/api/leads/${lead.id}/assign`, {
      method: 'PATCH',
      body: { sellerId: props.sellerId },
    })
    await Promise.all([fetchPool(), fetchMyLeads()])
  } finally {
    takingId.value = null
  }
}

function openLead(lead) {
  selectedLead.value = lead
}

function closeLead() {
  selectedLead.value = null
}

// ── Utilities ───────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?'
}

function statusLabel(s) {
  return { COMPLETED: 'Завершил', ABANDONED: 'Ушёл', IN_PROGRESS: 'In progress' }[s] || s
}

function funnelWidth(step) {
  const max = Math.max(...Object.values(analytics.value?.dropoffByStep || {}), 1)
  const val = analytics.value?.dropoffByStep?.[step] || 0
  return Math.round((val / max) * 100) + '%'
}

function utmWidth(count) {
  const max = Math.max(...Object.values(analytics.value?.utmSources || {}), 1)
  return Math.round((count / max) * 100) + '%'
}

// ── Lifecycle ────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchPool(), fetchMyLeads(), fetchAnalytics()])
})

watch(activeTab, (tab) => {
  if (tab === 'pool') fetchPool()
  if (tab === 'my') fetchMyLeads()
  if (tab === 'analytics') fetchAnalytics()
})
</script>

<style scoped>
/* ════════════════════════════════════════════
   SELLER DASHBOARD
   Palette: brand green (dark-green / emerald-green)
════════════════════════════════════════════ */
.seller-dashboard {
  --bg: var(--white);
  --bg-2: var(--soft-white);
  --bg-3: var(--light-grey);
  --border: var(--border-light);
  --text: var(--text-primary);
  --text-muted: var(--text-secondary);
  --accent: var(--dark-green);
  --accent-dim: var(--surface-green);
  --clr-completed: var(--success);
  --clr-abandoned: var(--danger);
  --clr-progress: var(--warning);
  --radius: var(--radius-small);
  --font: var(--font-aeonik);
}

.seller-dashboard {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ── Header ── */
.sd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.sd-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: var(--font-bold);
  font-size: 15px;
  letter-spacing: .04em;
  color: var(--text-primary);
}

.sd-header__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--emerald-green);
  box-shadow: 0 0 8px var(--emerald-green);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}

.sd-header__seller {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-muted);
}

.sd-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--emerald-green);
  color: var(--dark-green);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Main ── */
.sd-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* ── Tabs ── */
.sd-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: var(--bg-2);
  padding: 5px;
  border-radius: 12px;
  border: 1px solid var(--border);
  width: fit-content;
}

.sd-tabs__btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
}

.sd-tabs__btn:hover { color: var(--text); background: var(--bg-3); }

.sd-tabs__btn--active {
  background: var(--dark-green) !important;
  color: var(--soft-white) !important;
  font-weight: var(--font-bold);
}

.sd-tabs__icon { font-size: 16px; }

.sd-tabs__badge {
  background: var(--danger);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  min-width: 18px;
  text-align: center;
}

.sd-tabs__btn--active .sd-tabs__badge {
  background: rgba(255,255,255,0.25);
  color: var(--soft-white);
}

/* ── Section ── */
.sd-section__head { margin-bottom: 20px; }

.sd-section__title {
  font-size: 20px;
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 4px;
}

.sd-section__sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Loading / Empty ── */
.sd-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 14px;
  padding: 40px 0;
}

.sd-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-top-color: var(--emerald-green);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.sd-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

.sd-empty span { font-size: 36px; display: block; margin-bottom: 10px; }
.sd-empty p { font-size: 14px; margin: 0; }

/* ── Table ── */
.sd-table-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.sd-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.sd-table thead {
  background: var(--bg-2);
}

.sd-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}

.sd-table__row {
  border-bottom: 1px solid var(--border);
  transition: background .15s;
}

.sd-table__row:last-child { border-bottom: none; }
.sd-table__row:hover { background: var(--bg-2); }

.sd-table td {
  padding: 12px 16px;
  vertical-align: middle;
  color: var(--text-primary);
}

.sd-table__name { font-weight: 500; }
.sd-table__date { color: var(--text-muted); font-size: 13px; }

/* ── Progress bar ── */
.sd-progress {
  background: var(--bg-3);
  border-radius: 4px;
  height: 4px;
  width: 80px;
  position: relative;
  overflow: hidden;
}

.sd-progress__bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--emerald-green);
}

.sd-progress span {
  position: absolute;
  right: -36px;
  top: -4px;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Progress в таблице нужна обёртка */
.sd-table td .sd-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  height: auto;
  overflow: visible;
}

.sd-table td .sd-progress__bar {
  position: static;
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
  width: auto;
}

.sd-table td .sd-progress span {
  position: static;
  font-size: 12px;
}

/* ── Buttons ── */
.sd-btn {
  padding: 7px 16px;
  border-radius: 8px;
  border: none;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
}

.sd-btn--take {
  background: var(--surface-green);
  color: var(--dark-green);
  border: 1px solid var(--emerald-green);
}

.sd-btn--take:hover:not(:disabled) {
  background: var(--emerald-green);
  color: var(--dark-green);
}

.sd-btn--take:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* ── Tags ── */
.sd-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.sd-tag--source {
  background: var(--bg-3);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

/* ── Status badges ── */
.sd-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.sd-badge--completed { background: rgba(0, 221, 120, .12); color: var(--clr-completed); border: 1px solid rgba(0, 221, 120, .3); }
.sd-badge--abandoned { background: rgba(240, 91, 91, .12); color: var(--clr-abandoned); border: 1px solid rgba(240, 91, 91, .3); }
.sd-badge--in_progress { background: rgba(244, 183, 64, .15); color: var(--clr-progress); border: 1px solid rgba(244, 183, 64, .35); }

/* ── Cards (My leads) ── */
.sd-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.sd-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all .2s;
}

.sd-card:hover {
  border-color: var(--emerald-green);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.sd-card__top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.sd-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--dark-green), var(--emerald-green));
  color: var(--soft-white);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sd-card__info { flex: 1; min-width: 0; }
.sd-card__name { font-weight: 600; font-size: 15px; color: var(--text-primary); }
.sd-card__meta { font-size: 13px; color: var(--text-muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sd-card__progress { margin-bottom: 14px; }
.sd-card__progress .sd-progress { background: var(--bg-3); border-radius: 4px; height: 5px; overflow: visible; display: block; position: relative; }

.sd-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sd-card__date { font-size: 12px; color: var(--text-muted); }

/* ── Analytics ── */
.sd-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 30px;
}

.sd-metric {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.sd-metric--green { border-color: rgba(0, 221, 120, .3); }
.sd-metric--red { border-color: rgba(240, 91, 91, .3); }
.sd-metric--yellow { border-color: rgba(244, 183, 64, .3); }

.sd-metric__value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.sd-metric--green .sd-metric__value { color: var(--clr-completed); }
.sd-metric--red .sd-metric__value { color: var(--clr-abandoned); }
.sd-metric--yellow .sd-metric__value { color: var(--clr-progress); }

.sd-metric__label { font-size: 13px; color: var(--text-muted); }

.sd-chart-block {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
}

.sd-chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px;
}

/* Funnel */
.sd-funnel { display: flex; flex-direction: column; gap: 12px; }

.sd-funnel__row {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.sd-funnel__label { font-size: 13px; color: var(--text-muted); }

.sd-funnel__track {
  background: var(--bg-3);
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
}

.sd-funnel__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--danger), #f7a3a3);
  border-radius: 4px;
  transition: width .6s cubic-bezier(.4, 0, .2, 1);
}

.sd-funnel__count { font-size: 13px; color: var(--text-muted); text-align: right; }

/* Donut */
.sd-donut-wrap {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.sd-donut {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.sd-donut__pct {
  font-size: 22px;
  font-weight: 700;
  fill: var(--text-primary);
  font-family: var(--font);
}

.sd-donut__sub {
  font-size: 9px;
  fill: var(--text-secondary);
  font-family: var(--font);
}

.sd-donut__legend { display: flex; flex-direction: column; gap: 12px; }

.sd-donut__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-primary);
}

.sd-donut__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Bar chart (UTM) */
.sd-bar-chart { display: flex; flex-direction: column; gap: 12px; }

.sd-bar-chart__row {
  display: grid;
  grid-template-columns: 100px 1fr 40px;
  align-items: center;
  gap: 12px;
}

.sd-bar-chart__label { font-size: 13px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sd-bar-chart__track {
  background: var(--bg-3);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.sd-bar-chart__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--dark-green), var(--emerald-green));
  border-radius: 4px;
  transition: width .6s;
}

.sd-bar-chart__count { font-size: 13px; color: var(--text-muted); text-align: right; }

/* ── Popup ── */
.sd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 51, 35, .45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.sd-popup {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  position: relative;
  animation: popIn .2s ease;
}

@keyframes popIn {
  from { transform: scale(.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.sd-popup__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-3);
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}

.sd-popup__close:hover {
  border-color: var(--emerald-green);
  color: var(--dark-green);
}

.sd-popup__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.sd-popup__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--dark-green), var(--emerald-green));
  color: var(--soft-white);
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sd-popup__name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.sd-popup__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.sd-popup__field {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
}

.sd-popup__field-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.sd-popup__field-val {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.sd-popup__answers-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.sd-answer {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 10px;
}

.sd-answer__q {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sd-answer__num {
  width: 22px;
  height: 22px;
  background: var(--surface-green);
  color: var(--dark-green);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.sd-answer__a {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  padding-left: 32px;
}
</style>