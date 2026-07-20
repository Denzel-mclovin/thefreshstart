<template>
  <section class="sd-section">
    <div class="sd-section__head">
      <h2 class="sd-section__title">
        Hi, {{ sellerStore.user?.name || sellerStore.user?.firstName || 'Seller' }} 👋
      </h2>
      <!-- <p class="sd-section__sub">
        Here's what's happening
        <span
          class="sd-status-badge"
          :class="`sd-status-badge--${(sellerStore.user?.approved || '').toLowerCase()}`"
        >
          {{ approvedLabel }}
        </span>
      </p> -->
    </div>

    <div v-if="loading" class="sd-loading">
      <span class="sd-spinner"></span> Loading...
    </div>

    <div v-else class="sd-overview">
      <div class="sd-metrics">
        <div class="sd-metric">
          <div class="sd-metric__icon">👥</div>
          <div class="sd-metric__value">{{ analytics?.total || 0 }}</div>
          <div class="sd-metric__label">Total leads</div>
        </div>
        <div class="sd-metric sd-metric--green">
          <div class="sd-metric__icon">✅</div>
          <div class="sd-metric__value">{{ analytics?.completed || 0 }}</div>
          <div class="sd-metric__label">Completed quiz</div>
        </div>
        <div class="sd-metric">
          <div class="sd-metric__icon">📋</div>
          <div class="sd-metric__value">{{ sellerStore.myLeads?.length || 0 }}</div>
          <div class="sd-metric__label">My leads</div>
        </div>
        <div class="sd-metric sd-metric--yellow">
          <div class="sd-metric__icon">⏳</div>
          <div class="sd-metric__value">{{ sellerStore.freeLeads?.length || 0 }}</div>
          <div class="sd-metric__label">Free leads</div>
        </div>
      </div>

      <!-- <div class="sd-overview__grid">
        <div class="sd-chart-block sd-overview__feed">
          <h3 class="sd-chart-title">Recent activity</h3>

          <div v-if="!activity.length" class="sd-empty sd-empty--inline">
            <span>🕊️</span>
            <p>No recent activity yet</p>
          </div>

          <ul v-else class="sd-feed">
            <li v-for="item in activity" :key="item.id" class="sd-feed__item">
              <span class="sd-feed__icon" :class="`sd-feed__icon--${iconClass(item.type)}`">
                {{ eventIcon(item.type) }}
              </span>
              <div class="sd-feed__body">
                <div class="sd-feed__text">{{ eventText(item) }}</div>
                <div class="sd-feed__time">{{ timeAgo(item.createdAt) }}</div>
              </div>
            </li>
          </ul>
        </div>

        <div class="sd-chart-block sd-overview__attention">
          <h3 class="sd-chart-title">Needs attention</h3>

          <div v-if="!staleLeads.length" class="sd-empty sd-empty--inline">
            <span>🎉</span>
            <p>No leads waiting too long</p>
          </div>

          <ul v-else class="sd-attention-list">
            <li v-for="lead in staleLeads" :key="lead.id" class="sd-attention-item">
              <div class="sd-attention-item__info">
                <div class="sd-attention-item__name">
                  {{ lead.firstName || '—' }} {{ lead.lastName || '' }}
                </div>
                <div class="sd-attention-item__meta">
                  Waiting {{ waitingFor(lead.createdAt) }}
                </div>
              </div>
              <span class="sd-tag sd-tag--warn">{{ lead.utmSource || 'direct' }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="sd-chart-block">
        <h3 class="sd-chart-title">New leads, last 7 days</h3>
        <div class="sd-trend">
          <div
            v-for="day in trend"
            :key="day.date"
            class="sd-trend__col"
          >
            <div class="sd-trend__bar-track">
              <div
                class="sd-trend__bar"
                :style="{ height: trendHeight(day.count) }"
                :title="`${day.count} leads`"
              ></div>
            </div>
            <div class="sd-trend__count">{{ day.count }}</div>
            <div class="sd-trend__label">{{ day.label }}</div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSellerStore } from '~~/stores/seller'

const sellerStore = useSellerStore()

const analytics = ref(null)
const activity = ref([])
const trend = ref([])
const loading = ref(true)

const approvedLabel = computed(() => {
  const map = { APPROVED: 'Approved', PENDING: 'On review', REJECTED: 'Rejected' }
  return map[sellerStore.user?.approved] || sellerStore.user?.approved || ''
})

// Leads sitting unassigned for more than 24h, soonest-waiting first
const staleLeads = computed(() => {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  return (sellerStore.freeLeads || [])
    .filter((lead) => now - new Date(lead.createdAt).getTime() > dayMs)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 5)
})

function waitingFor(date) {
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60))
  if (hours < 48) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function eventIcon(type) {
  return {
    LEAD_CREATED: '🆕',
    LEAD_TAKEN: '🤝',
    LEAD_COMPLETED: '✅',
    SELLER_JOINED: '👋',
  }[type] || '•'
}

function iconClass(type) {
  return {
    LEAD_CREATED: 'blue',
    LEAD_TAKEN: 'purple',
    LEAD_COMPLETED: 'green',
    SELLER_JOINED: 'yellow',
  }[type] || 'default'
}

function eventText(item) {
  const name = item.leadName || 'A lead'
  return {
    LEAD_CREATED: `${name} started the quiz`,
    LEAD_TAKEN: `${item.sellerName || 'A seller'} took ${name} into work`,
    LEAD_COMPLETED: `${name} completed the quiz`,
    SELLER_JOINED: `${item.sellerName || 'A new seller'} joined the platform`,
  }[item.type] || 'New activity'
}

function trendHeight(count) {
  const max = Math.max(...trend.value.map((d) => d.count), 1)
  return Math.round((count / max) * 100) + '%'
}

onMounted(async () => {
  try {
    const res = await sellerStore.getSellerAnalytic()

    console.log('Seller analytics:', res)
    if (res.success) analytics.value = res.analytics

    await Promise.all([
      sellerStore.fetchMyLeads(),
      sellerStore.getFreeLeads(),
    ])

    // Expected once the activity/trend endpoints exist:
    // const activityRes = await sellerStore.getActivityFeed()
    // activity.value = activityRes.events || []
    // const trendRes = await sellerStore.getLeadsTrend()
    // trend.value = trendRes.days || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

definePageMeta({
  layout: 'seller',
})
</script>

<style scoped>
.sd-section__head { 
  margin-bottom: 40px; 
  padding-top: 50px; 
}
.sd-section__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sd-section__sub {
  font-size: 1rem;
  color: #999;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sd-status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  background: #e8f9f0; color: #16a34a; border: 1px solid #bbf0d4;
}
.sd-status-badge--pending { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.sd-status-badge--rejected { background: #fff0f3; color: #dc2626; border-color: #fecdd3; }

.sd-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}
.sd-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e8e0f0;
  border-top-color: #480074;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.sd-empty { text-align: center; padding: 60px 0; color: #999; }
.sd-empty--inline { padding: 30px 0; }
.sd-empty span { font-size: 32px; display: block; margin-bottom: 8px; }
.sd-empty p { font-size: 13px; margin: 0; }

/* KPI cards */
.sd-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}
.sd-metric {
  background: #fff;
  border: 1px solid #e8e0f0;
  border-radius: 14px;
  padding: 22px 20px;
  box-shadow: 0 2px 10px rgba(72,0,116,0.06);
  border-top: 3px solid #e8e0f0;
}
.sd-metric--green { border-top-color: #16a34a; }
.sd-metric--yellow { border-top-color: #d97706; }
.sd-metric__icon { font-size: 22px; margin-bottom: 10px; }
.sd-metric__value { font-size: 36px; font-weight: 700; line-height: 1; margin-bottom: 6px; color: #1a1a2e; }
.sd-metric--green .sd-metric__value { color: #16a34a; }
.sd-metric--yellow .sd-metric__value { color: #d97706; }
.sd-metric__label { font-size: 13px; color: #999; }

/* Two-column grid for feed + attention */
.sd-overview__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 900px) {
  .sd-overview__grid { grid-template-columns: 1fr; }
}

.sd-chart-block {
  background: #fff;
  border: 1px solid #e8e0f0;
  border-radius: 14px;
  padding: 26px;
  box-shadow: 0 2px 10px rgba(72,0,116,0.06);
}
.sd-chart-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 20px;
}

/* Activity feed */
.sd-feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sd-feed__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.sd-feed__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
  background: #f0ebf8;
}
.sd-feed__icon--green { background: #e8f9f0; }
.sd-feed__icon--yellow { background: #fffbeb; }
.sd-feed__icon--blue { background: #eef4ff; }
.sd-feed__icon--purple { background: #f0ebf8; }

.sd-feed__text { font-size: 14px; color: #1a1a2e; font-weight: 500; }
.sd-feed__time { font-size: 12px; color: #999; margin-top: 2px; }

/* Needs attention */
.sd-attention-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sd-attention-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #f0ebf8;
  border-radius: 10px;
}
.sd-attention-item__name { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.sd-attention-item__meta { font-size: 12px; color: #d97706; margin-top: 2px; }

.sd-tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background: #f0ebf8;
  color: #480074;
  border: 1px solid #e0d0f0;
  flex-shrink: 0;
}
.sd-tag--warn { background: #fffbeb; color: #d97706; border-color: #fde68a; }

/* 7-day trend */
.sd-trend {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  align-items: end;
  height: 160px;
}
.sd-trend__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.sd-trend__bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sd-trend__bar {
  width: 60%;
  min-height: 4px;
  background: linear-gradient(180deg, #8a00d4, #480074);
  border-radius: 4px 4px 0 0;
  transition: height .4s cubic-bezier(.4, 0, .2, 1);
}
.sd-trend__count { font-size: 12px; font-weight: 700; color: #1a1a2e; margin-top: 6px; }
.sd-trend__label { font-size: 11px; color: #999; margin-top: 2px; }
</style>