<template>
  <section class="ad-section">
    <div class="ad-section__head">
      <div>
        <h2 class="ad-section__title">All Leads</h2>
        <p class="ad-section__sub">Full list of users</p>
      </div>
      <div class="ad-head-controls">
        <div class="ad-leads-filter ad-leads-filter--inline">
          <button
            v-for="f in leadFilters"
            :key="f.val"
            class="ad-filter-btn"
            :class="{ 'ad-filter-btn--active': globalLeadFilter === f.val }"
            @click="globalLeadFilter = f.val"
          >
            {{ f.label }}
          </button>
        </div>
        <div class="ad-search">
          <input
            v-model="leadSearch"
            class="ad-input"
            placeholder="Search by name / phone..."
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="ad-loading">
      <span class="ad-spinner"></span> Loading...
    </div>

    <div v-else-if="filteredAllLeads.length === 0" class="ad-empty">
      <span>🔍</span><p>Leads not found</p>
    </div>

    <div v-else class="ad-table-wrap">
      <table class="ad-table ad-table--full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Seller</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Source</th>
            <th>Content</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="lead in filteredAllLeads"
            :key="lead.id"
            class="ad-table__row"
          >
            <td class="ad-table__name">
              {{ lead.firstName || '—' }} {{ lead.lastName || '' }}
            </td>
            <td>{{ lead.phone || '—' }}</td>
            <td>{{ lead.email || '—' }}</td>
            <td>
              <div v-if="lead.seller" class="ad-seller-chip">
                <span
                  class="ad-seller-chip__dot"
                  :style="{ background: sellerColor(lead.seller.id) }"
                ></span>
                {{ lead.seller.name }} {{ lead.seller.lastName }}
              </div>
              <span v-else class="ad-unassigned">Free lead</span>
            </td>
            <td>
              <span class="ad-badge" :class="`ad-badge--${lead.status.toLowerCase()}`">
                {{ statusLabel(lead.status) }}
              </span>
            </td>
            <td>
              <div class="ad-mini-progress">
                <div class="ad-mini-progress__track">
                  <div
                    class="ad-mini-progress__fill"
                    :style="{ width: ((lead.answers?.length || 0) / 5 * 100) + '%' }"
                  ></div>
                </div>
                <span>{{ lead.answers?.length || 0 }}/5</span>
              </div>
            </td>
            <td><span class="ad-tag">{{ lead.utmSource || 'direct' }}</span></td>
            <td><span class="ad-seller-chip__dot">{{ lead.utmContent || '-' }}</span></td>
            <td class="ad-table__date">{{ formatDate(lead.createdAt) }}</td>
            <td>
              <button class="ad-eye-btn" @click="$emit('open-lead', lead)">👁</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>

// ── Variables ────────────────────────────────────────────


const loading = ref(false)
const leads = ref([])


// ── State ──────────────────────────────────────────────
const leadSearch = ref('')
const globalLeadFilter = ref('all')

const leadFilters = [
  { val: 'all', label: 'All' },
  { val: 'COMPLETED', label: 'Completed' },
  { val: 'ABANDONED', label: 'Abandoned' },
  { val: 'IN_PROGRESS', label: 'In Progress' },
]

// ── Computed ──────────────────────────────────────────
const filteredAllLeads = computed(() => {
  let list = leads.value
  if (globalLeadFilter.value !== 'all') {
    list = list.filter(l => l.status === globalLeadFilter.value)
  }
  const q = leadSearch.value.toLowerCase()
  if (q) {
    list = list.filter(l =>
      ((l.firstName || '') + ' ' + (l.lastName || '') + ' ' + (l.phone || '') + ' ' + (l.email || ''))
        .toLowerCase().includes(q)
    )
  }
  return list
})

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

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusLabel(s) {
  return { COMPLETED: 'Completed', ABANDONED: 'Abandoned', IN_PROGRESS: 'In progress' }[s] || s
}

const fetchLeads = async () => {
  try {
    loading.value = true

    const res = await $fetch('/api/admin/leads')

    if (res.success) {
      leads.value = res.leads
    }

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async() => {
  await fetchLeads()

  console.log(leads.value)
})

definePageMeta({
  layout: 'admin',
})
</script>

<style scoped>

.ad-section {
  padding: 30px 15px;
  color: white;

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

.ad-head-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ad-input {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  outline: none;
  width: 220px;
  transition: border-color 0.2s;
}

.ad-input:focus {
  border-color: var(--accent);
}

.ad-input::placeholder {
  color: var(--text-muted);
}

.ad-leads-filter {
  display: flex;
  gap: 4px;
}

.ad-filter-btn {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #bde4d2;
  background: var(--bg-2);
  color: var(--text-muted);
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ad-filter-btn:hover {
  color: var(--text);
}

.ad-filter-btn--active {
  background: #e0f7ea;
  border-color: var(--secondary-btn-hover);
  color: var(--dark-green);
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

.ad-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

.ad-empty span {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

.ad-empty p {
  font-size: 14px;
  margin: 0;
}

.ad-table-wrap {
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.ad-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #fff;
  font-family: var(--font-aeonik);
}

.ad-table thead {
  background: var(--soft-green);
}

.ad-table th {
  padding: 13px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--dark-green);
  border-bottom: 1px solid var(--border-light);
}

.ad-table__row {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s;
}

.ad-table__row:last-child {
  border-bottom: none;
}

.ad-table__row:hover {
  background: rgba(0, 221, 120, 0.05);
  cursor: pointer;
}

.ad-table td {
  padding: 13px 16px;
  vertical-align: middle;
  color: black;
}

.ad-table__name {
  font-weight: 600;
  color: var(--dark-green);
}

.ad-table__date {
  color: #999;
  font-size: 13px;
}

.ad-mini-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ad-mini-progress__track {
  width: 60px;
  height: 4px;
  background: var(--chart-track);
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.ad-mini-progress__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--emerald-green),
    #25f096
  );
  border-radius: 3px;
  transition: width 0.3s;
}

.ad-mini-progress span {
  font-size: 11px;
  color: var(--text-muted);
}


.ad-tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background: var(--dark-green);
  color: var(--soft-white);
  border: 1px solid var(--border-light);
}


.ad-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.ad-badge--completed {
  background: #22d67a1a;
  color: #22d67a;
  border: 1px solid #22d67a40;
}

.ad-badge--abandoned {
  background: #ff4d6d1a;
  color: #ff4d6d;
  border: 1px solid #ff4d6d40;
}

.ad-badge--in_progress {
  background: #f59e0b1a;
  color: #f59e0b;
  border: 1px solid #f59e0b40;
}

.ad-seller-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.ad-seller-chip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ad-unassigned {
  font-size: 12px;
  color: var(--text-muted);
}

.ad-eye-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--chart-track);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.ad-eye-btn:hover {
  border-color: var(--accent);
}
</style>