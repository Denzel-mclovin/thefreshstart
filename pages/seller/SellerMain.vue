<template>
  <div class="seller-dashboard">
    <!-- Header -->
    <header class="sd-header">
      <div class="sd-header__logo">
        <span class="sd-header__dot"></span>
        <span>CRM </span>
      </div>
      <div class="sd-header__seller">
        <span class="sd-header__avatar">{{ sellerInitials }}</span>
        <span>{{ currentSeller?.name }} {{ currentSeller?.surname }}</span>
      </div>
    </header>

    <main class="sd-main">
      <!-- Tabs -->
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

      <!-- Tab views -->
      <!-- <LeadPool
        v-if="activeTab === 'pool'"
        :leads="poolLeads"
        :loading="loadingPool"
        :taking-id="takingId"
        @take="takeLead"
      /> -->

      <!-- <MyLeads
        v-if="activeTab === 'my'"
        :leads="myLeads"
        :loading="loadingMy"
      />

      <SellerAnalytics
        v-if="activeTab === 'analytics'"
        :analytics="analytics"
        :loading="loadingAnalytics"
      /> -->
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// import LeadPool from './LeadPool.vue'
// import MyLeads from './MyLeads.vue'
// import SellerAnalytics from './SellerAnalytics.vue'

const props = defineProps({
  sellerId: { type: String, required: true },
})

// State
const activeTab = ref('pool')
const takingId = ref(null)

const poolLeads = ref([])
const myLeads = ref([])
const analytics = ref(null)
const currentSeller = ref(null)

const loadingPool = ref(false)
const loadingMy = ref(false)
const loadingAnalytics = ref(false)

// Tabs
const tabs = computed(() => [
  { id: 'pool', label: 'Свободные лиды', icon: '🎯', count: poolLeads.value.length || null },
  { id: 'my', label: 'Мои лиды', icon: '👤', count: myLeads.value.length || null },
  { id: 'analytics', label: 'Аналитика', icon: '📊', count: null },
])

const sellerInitials = computed(() => {
  if (!currentSeller.value) return '?'
  return (currentSeller.value.name?.[0] || '') + (currentSeller.value.surname?.[0] || '')
})

// Fetch
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

// Actions
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

// Lifecycle
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
.seller-dashboard {
  font-family: var(--font-aeonik);
  background: var(--soft-white);
  color: var(--text-primary);
  min-height: 100vh;
}

/* Header */
.sd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: var(--white);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-card);
}

.sd-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: var(--font-bold);
  font-size: 15px;
  letter-spacing: .04em;
  color: var(--dark-green);
}

.sd-header__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dark-green);
  box-shadow: 0 0 8px rgba(0, 51, 35, 0.5);
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
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--dark-green), var(--emerald-green));
  color: var(--soft-white);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-small);
}

/* Main */
.sd-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
}

/* Tabs */
.sd-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 30px;
  background: var(--white);
  padding: 5px;
  border-radius: var(--radius-medium);
  border: 1px solid var(--border-light);
  width: fit-content;
  box-shadow: var(--shadow-card);
}

.sd-tabs__btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: var(--radius-small);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-aeonik);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
}

.sd-tabs__btn:hover {
  color: var(--dark-green);
  background: var(--surface-green);
}

.sd-tabs__btn--active {
  background: var(--dark-green) !important;
  color: var(--soft-white) !important;
  font-weight: var(--font-bold);
  box-shadow: 0 4px 14px rgba(0, 51, 35, 0.3);
}

.sd-tabs__icon { font-size: 16px; }

.sd-tabs__badge {
  background: var(--danger);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  min-width: 18px;
  text-align: center;
}

.sd-tabs__btn--active .sd-tabs__badge {
  background: rgba(255,255,255,0.25);
  color: var(--soft-white);
}
</style>
