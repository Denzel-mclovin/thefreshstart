<template>

    <div class="seller_analytics_main">

<!-- v-if="activeTab === 'analytics'" -->
         <section  class="sd-section">
        <div class="sd-section__head">
          <h2 class="sd-section__title">Quiz analytics</h2>
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
                  <!-- :style="{ width: funnelWidth(step) }" -->
                  <div
                    class="sd-funnel__fill"
                    
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

    </div>
</template>


<script setup>

// -- Imports ---------------------------------

// -- State & Refs --------------------------------

// const selectedLead = ref(null)
// const takingId = ref(null)

// const poolLeads = ref([])
// const myLeads = ref([])
const analytics = ref(null)
// const currentSeller = ref(null)

// const loadingPool = ref(false)
// const loadingMy = ref(false)
const loadingAnalytics = ref(false)



// ── Fetch ───────────────────────────────────────────────

async function fetchAnalytics() {
  loadingAnalytics.value = true
  try {
    analytics.value = await $fetch('/api/analytics')
  } finally {
    loadingAnalytics.value = false
  }
}

// ── Computed helpers ────────────────────────────────────


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


// ── Lifecycle ────────────────────────────────────────────

onMounted(async () => {
    console.log("fetch analitic")
//   await Promise.all([fetchAnalytics()])
})

definePageMeta({
  layout: "seller",
});


</script>



<style scoped lang="scss">

.seller_analytics_main {
  padding: 20px;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
}

.sd-section__head { margin-bottom: 20px; }

.sd-section__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px;
}

.sd-section__sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

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
  border-top-color: var(--accent);
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

.sd-metric--green { border-color: #22d67a40; }
.sd-metric--red { border-color: #ff4d6d40; }
.sd-metric--yellow { border-color: #f59e0b40; }

.sd-metric__value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
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
  background: linear-gradient(90deg, #ff4d6d, #ff8fa3);
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
  fill: var(--text);
  font-family: var(--font);
}

.sd-donut__sub {
  font-size: 9px;
  fill: var(--text-muted);
  font-family: var(--font);
}

.sd-donut__legend { display: flex; flex-direction: column; gap: 12px; }

.sd-donut__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
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
  background: linear-gradient(90deg, var(--accent), #00a8ff);
  border-radius: 4px;
  transition: width .6s;
}

.sd-bar-chart__count { font-size: 13px; color: var(--text-muted); text-align: right; }


</style>