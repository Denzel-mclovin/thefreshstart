<template>
  <section class="ad-section">
    <div class="ad-section__head">
      <h2 class="ad-section__title">Analytics</h2>
      <p class="ad-section__sub">Overall system statistics</p>
    </div>
 
    <div v-if="loading" class="ad-loading">
      <span class="ad-spinner"></span> Loading...
    </div>
 
    <div v-else class="ad-analytics">
      <div class="ad-metrics">
        <div class="ad-metric">
          <div class="ad-metric__icon">👥</div>
          <div class="ad-metric__val">{{ analytics?.total || 0 }}</div>
          <div class="ad-metric__lbl">Total Leads</div>
        </div>
        <div class="ad-metric ad-metric--green">
          <div class="ad-metric__icon">✅</div>
          <div class="ad-metric__val">{{ analytics?.completed || 0 }}</div>
          <div class="ad-metric__lbl">Completed Quiz</div>
        </div>
        <div class="ad-metric ad-metric--red">
          <div class="ad-metric__icon">❌</div>
          <div class="ad-metric__val">{{ analytics?.abandoned || 0 }}</div>
          <div class="ad-metric__lbl">Abandoned Quiz</div>
        </div>
        <div class="ad-metric ad-metric--yellow">
          <div class="ad-metric__icon">⏳</div>
          <div class="ad-metric__val">{{ analytics?.inProgress || 0 }}</div>
          <div class="ad-metric__lbl">In Progress</div>
        </div>
        <div class="ad-metric ad-metric--blue">
          <div class="ad-metric__icon">🏷️</div>
          <div class="ad-metric__val">{{ analytics?.assigned || 0 }}</div>
          <div class="ad-metric__lbl">Assigned</div>
        </div>
        <div class="ad-metric ad-metric--orange">
          <div class="ad-metric__icon">🆓</div>
          <div class="ad-metric__val">{{ analytics?.unassigned || 0 }}</div>
          <div class="ad-metric__lbl">Unassigned</div>
        </div>
      </div>
 
      <div class="ad-charts-grid">
        <div class="ad-chart-box">
          <h3 class="ad-chart-title">Quiz completion</h3>
          <div class="ad-donut-wrap">
            <svg viewBox="0 0 140 140" class="ad-donut" xmlns="http://www.w3.org/2000/svg">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1e2433" stroke-width="16"/>
              <circle
                cx="70" cy="70" r="54"
                fill="none" stroke="#ff4d6d" stroke-width="16"
                stroke-dasharray="339.29"
                :stroke-dashoffset="abandonedOffset"
                stroke-linecap="round"
                transform="rotate(-90 70 70)"
              />
              <circle
                cx="70" cy="70" r="54"
                fill="none" stroke="#22d67a" stroke-width="16"
                stroke-dasharray="339.29"
                :stroke-dashoffset="completedOffset"
                stroke-linecap="round"
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="64" text-anchor="middle" class="ad-donut__pct">{{ completionRate }}%</text>
              <text x="70" y="80" text-anchor="middle" class="ad-donut__sub">Completed</text>
            </svg>
            <div class="ad-donut-legend">
              <div class="ad-legend-item">
                <span class="ad-legend-dot" style="background:#22d67a"></span>
                Completed ({{ analytics?.completed || 0 }})
              </div>
              <div class="ad-legend-item">
                <span class="ad-legend-dot" style="background:#ff4d6d"></span>
                Abandoned ({{ analytics?.abandoned || 0 }})
              </div>
              <div class="ad-legend-item">
                <span class="ad-legend-dot" style="background:#f59e0b"></span>
                In Progress ({{ analytics?.inProgress || 0 }})
              </div>
            </div>
          </div>
        </div>
 
        <div class="ad-chart-box">
          <h3 class="ad-chart-title">Where do they leave the quiz?</h3>
          <div class="ad-funnel">
            <div v-for="step in 5" :key="step" class="ad-funnel__row">
              <div class="ad-funnel__label">Step {{ step }}</div>
              <div class="ad-funnel__track">
                <div
                  class="ad-funnel__fill"
                  :style="{ width: dropoffWidth(step) }"
                ></div>
              </div>
              <div class="ad-funnel__count">{{ analytics?.dropoffByStep?.[step] || 0 }}</div>
            </div>
          </div>
        </div>
 
        <div class="ad-chart-box ad-chart-box--wide">
          <h3 class="ad-chart-title">Leads by Salespeople</h3>
          <div class="ad-bar-chart">
            <div
              v-for="s in analytics?.sellerStats || []"
              :key="s.id"
              class="ad-bar-chart__row"
            >
              <div class="ad-bar-chart__seller">
                <span
                  class="ad-bar-chart__dot"
                  :style="{ background: sellerColor(s.id) }"
                ></span>
                {{ s.name }} {{ s.surname }}
              </div>
              <div class="ad-bar-chart__bars">
                <div class="ad-bar-chart__track">
                  <div
                    class="ad-bar-chart__fill"
                    :style="{ width: barWidth(s.totalLeads), background: sellerColor(s.id) }"
                    :title="`Total: ${s.totalLeads}`"
                  ></div>
                </div>
                <div class="ad-bar-chart__track ad-bar-chart__track--thin">
                  <div
                    class="ad-bar-chart__fill"
                    :style="{ width: barWidth(s.completedLeads), background: '#22d67a' }"
                    :title="`Completed: ${s.completedLeads}`"
                  ></div>
                </div>
              </div>
              <div class="ad-bar-chart__nums">
                <span class="ad-bar-chart__total">{{ s.totalLeads }}</span>
                <span class="ad-bar-chart__completed">{{ s.completedLeads }} ✓</span>
              </div>
            </div>
            <div class="ad-bar-chart__legend">
              <span><span class="ad-legend-dot" style="background:#8892a4;width:12px;height:4px;border-radius:2px;display:inline-block;margin-right:6px;vertical-align:middle"></span>Total leads</span>
              <span><span class="ad-legend-dot" style="background:#22d67a;width:12px;height:4px;border-radius:2px;display:inline-block;margin-right:6px;vertical-align:middle"></span>Completed quiz</span>
            </div>
          </div>
        </div>
 
        <div class="ad-chart-box ad-chart-box--wide">
          <h3 class="ad-chart-title">Salespeople Efficiency</h3>
          <div class="ad-efficiency">
            <div
              v-for="s in sortedByEfficiency"
              :key="s.id"
              class="ad-efficiency__row"
            >
              <div class="ad-efficiency__seller">
                <div class="ad-avatar ad-avatar--sm" :style="{ background: sellerColor(s.id) }">
                  {{ initials(s.name, s.surname) }}
                </div>
                <span>{{ s.name }} {{ s.surname }}</span>
              </div>
              <div class="ad-efficiency__bar-wrap">
                <div class="ad-efficiency__track">
                  <div
                    class="ad-efficiency__fill"
                    :style="{ width: s.efficiency + '%', background: efficiencyColor(s.efficiency) }"
                  ></div>
                </div>
                <span class="ad-efficiency__pct" :style="{ color: efficiencyColor(s.efficiency) }">
                  {{ s.efficiency }}%
                </span>
              </div>
              <div class="ad-efficiency__meta">{{ s.completedLeads }}/{{ s.totalLeads }} leads</div>
            </div>
            <div v-if="!analytics?.sellerStats?.length" class="ad-empty-small">
              No data available for salespeople
            </div>
          </div>
        </div>
 
        <div class="ad-chart-box">
          <h3 class="ad-chart-title">Traffic Sources</h3>
          <div class="ad-utm">
            <div
              v-for="(count, src) in analytics?.utmSources"
              :key="src"
              class="ad-utm__row"
            >
              <div class="ad-utm__label">{{ src }}</div>
              <div class="ad-utm__track">
                <div class="ad-utm__fill" :style="{ width: utmWidth(count) }"></div>
              </div>
              <div class="ad-utm__count">{{ count }}</div>
              <div class="ad-utm__pct">
                {{ Math.round(count / (analytics?.total || 1) * 100) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'


const analytics = ref(null)
const loading = ref(true)
 
// ── Computed ──────────────────────────────────────────
const CIRC = 339.29
 
const completionRate = computed(() => {
  const t =  analytics.value?.total || 0
  const c =  analytics.value?.completed || 0
  if (!t) return 0
  return Math.round((c / t) * 100)
})
 
const completedOffset = computed(() => {
  const t =  analytics.value?.total || 0
  const c =  analytics.value?.completed || 0
  if (!t) return CIRC
  return CIRC - (c / t) * CIRC
})
 
const abandonedOffset = computed(() => {
  const t =  analytics.value?.total || 0
  const a =  analytics.value?.abandoned || 0
  if (!t) return CIRC
  return CIRC - (a / t) * CIRC
})
 
const sortedByEfficiency = computed(() => {
  return ( analytics.value?.sellerStats || [])
    .map((s) => ({
      ...s,
      efficiency: s.totalLeads ? Math.round((s.completedLeads / s.totalLeads) * 100) : 0,
    }))
    .sort((a, b) => b.efficiency - a.efficiency)
})
 

function dropoffWidth(step) {
  const map =  analytics.value?.dropoffByStep || {}
  const max = Math.max(...Object.values(map), 1)
  const val = map[step] || 0
  return Math.round((val / max) * 100) + '%'
}
 
function barWidth(count) {
  const max = Math.max(...( analytics.value?.sellerStats || []).map((s) => s.totalLeads), 1)
  return Math.round((count / max) * 100) + '%'
}
 
function utmWidth(count) {
  const max = Math.max(...Object.values( analytics.value?.utmSources || {}), 1)
  return Math.round((count / max) * 100) + '%'
}
 
function efficiencyColor(pct) {
  if (pct >= 70) return '#22d67a'
  if (pct >= 40) return '#f59e0b'
  return '#ff4d6d'
}
 
// ── Utilities ─────────────────────────────────────────
const SELLER_COLORS = [
  '#00e5c7', '#7c3aed', '#f59e0b', '#3b82f6',
  '#ec4899', '#10b981', '#f97316', '#8b5cf6',
]
const colorMap = new Map()
let colorIdx = 0
 
function sellerColor(id) {
  if (!colorMap.has(id)) {
    colorMap.set(id, SELLER_COLORS[colorIdx % SELLER_COLORS.length])
    colorIdx++
  }
  return colorMap.get(id) || SELLER_COLORS[0]
}
 
function initials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?'
}



const loadAnalytics = async () => {
  try {
    const res = await $fetch('/api/admin/analytics')

    if (res.success) {
      analytics.value = res.analytics
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})

  definePageMeta({
        layout: 'admin'
    })
</script>

<style scoped>
 
.ad-section {
  --bg: #ffffff;
  --bg-2: #faf8ff;
  --bg-3: #f4f0ff;
  --bg-4: #ede7ff;

  --border: #ddd6fe;

  --text: #2b2341;
  --text-muted: #7c7690;

  --accent: #7c3aed;
  --accent-hover: #8b5cf6;

  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;

  --radius: 10px;
  --font: "DM Sans", "Segoe UI", sans-serif;

  padding: 30px 15px;
}

.ad-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}

.ad-section__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--bg);
  margin: 0 0 4px;
}

.ad-section__sub {
  font-size: 13px;
  color: var(--bg);
  margin: 0;
}

.ad-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--soft-white);
  padding: 40px 0;
  font-size: 14px;
}

.ad-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-light);
  border-top-color: var(--emerald-green);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ad-empty-small {
  color: var(--text-muted);
  font-size: 13px;
  padding: 16px 0;
  text-align: center;
}

.ad-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ad-avatar--sm {
  width: 30px;
  height: 30px;
  font-size: 11px;
}

.ad-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.ad-metric {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
}

.ad-metric--green {
  border-color: #22d67a40;
}

.ad-metric--red {
  border-color: #ff4d6d40;
}

.ad-metric--yellow {
  border-color: #f59e0b40;
}

.ad-metric--blue {
  border-color: #3b82f640;
}

.ad-metric--orange {
  border-color: #f9731640;
}

.ad-metric__icon {
  font-size: 22px;
  margin-bottom: 8px;
}

.ad-metric__val {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
}

.ad-metric--green .ad-metric__val {
  color: #22d67a;
}

.ad-metric--red .ad-metric__val {
  color: #ff4d6d;
}

.ad-metric--yellow .ad-metric__val {
  color: #f59e0b;
}

.ad-metric--blue .ad-metric__val {
  color: #60a5fa;
}

.ad-metric--orange .ad-metric__val {
  color: #fb923c;
}

.ad-metric__lbl {
  font-size: 12px;
  color: var(--text-muted);
}

.ad-charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ad-chart-box {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}

.ad-chart-box--wide {
  grid-column: 1 / -1;
}

.ad-chart-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 18px;
}

.ad-donut-wrap {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.ad-donut {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.ad-donut__pct {
  font-size: 24px;
  font-weight: 700;
  fill: var(--text);
  font-family: "DM Sans", sans-serif;
}

.ad-donut__sub {
  font-size: 10px;
  fill: #7a8ba4;
  font-family: "DM Sans", sans-serif;
}

.ad-donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ad-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.ad-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ad-funnel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ad-funnel__row {
  display: grid;
  grid-template-columns: 55px 1fr 32px;
  align-items: center;
  gap: 10px;
}

.ad-funnel__label {
  font-size: 12px;
  color: var(--text-muted);
}

.ad-funnel__track {
  background: var(--bg-3);
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
}

.ad-funnel__fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4d6d, #ff8fa3);
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-funnel__count {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

.ad-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ad-bar-chart__row {
  display: grid;
  grid-template-columns: 160px 1fr 100px;
  align-items: center;
  gap: 16px;
}

.ad-bar-chart__seller {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  overflow: hidden;
}

.ad-bar-chart__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ad-bar-chart__bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ad-bar-chart__track {
  background: var(--bg-3);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.ad-bar-chart__track--thin {
  height: 5px;
}

.ad-bar-chart__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-bar-chart__nums {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.ad-bar-chart__total {
  color: var(--text-muted);
}

.ad-bar-chart__completed {
  color: #22d67a;
}

.ad-bar-chart__legend {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: var(--text-muted);
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.ad-efficiency {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ad-efficiency__row {
  display: grid;
  grid-template-columns: 180px 1fr 100px;
  align-items: center;
  gap: 16px;
}

.ad-efficiency__seller {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  overflow: hidden;
}

.ad-efficiency__bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ad-efficiency__track {
  flex: 1;
  background: var(--bg-3);
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
}

.ad-efficiency__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-efficiency__pct {
  font-size: 14px;
  font-weight: 700;
  min-width: 40px;
  text-align: right;
}

.ad-efficiency__meta {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

.ad-utm {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ad-utm__row {
  display: grid;
  grid-template-columns: 90px 1fr 32px 40px;
  align-items: center;
  gap: 10px;
}

.ad-utm__label {
  font-size: 12px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-utm__track {
  background: var(--bg-3);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.ad-utm__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #00a8ff);
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-utm__count {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

.ad-utm__pct {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

@media (max-width: 768px) {
  .ad-charts-grid {
    grid-template-columns: 1fr;
  }

  .ad-chart-box--wide {
    grid-column: 1;
  }

  .ad-bar-chart__row {
    grid-template-columns: 120px 1fr 80px;
  }

  .ad-efficiency__row {
    grid-template-columns: 140px 1fr 80px;
  }
}
</style>