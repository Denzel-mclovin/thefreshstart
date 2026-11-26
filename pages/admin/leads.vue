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
            @click="openLead(lead)"
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
              <div class="sd-popup__field-label">📞 Phone</div>
              <div class="sd-popup__field-val">{{ selectedLead.phone || '—' }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">✉️ Email</div>
              <div class="sd-popup__field-val">{{ selectedLead.email || '—' }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">📅 Registered</div>
              <div class="sd-popup__field-val">{{ formatDate(selectedLead.createdAt) }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">📍 Source</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmSource || 'direct' }}</div>
            </div>
            <div v-if="selectedLead.utmCampaign" class="sd-popup__field">
              <div class="sd-popup__field-label">🎯 Campaign</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmCampaign }}</div>
            </div>
            <div v-if="selectedLead.utmMedium" class="sd-popup__field">
              <div class="sd-popup__field-label">📢 Medium</div>
              <div class="sd-popup__field-val">{{ selectedLead.utmMedium }}</div>
            </div>
            <div class="sd-popup__field">
              <div class="sd-popup__field-label">🕒 Call</div>
              <div class="sd-popup__field-val">{{ formatDateTime(selectedLead.callScheduledFor) }}</div>
            </div>
          </div>

          <div class="sd-popup__answers">
            <h3 class="sd-popup__answers-title">Answers to Quiz</h3>
            <div v-if="!selectedLead.answers || selectedLead.answers.length === 0" class="sd-empty">
              <span>❓</span><p>No answers available</p>
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

          <div class="sd-popup__actions">
            <button
              class="sd-missed"
              :disabled="!!missedDisabledReason"
              @click="missedConfirm = true"
            >
              Missed a call
            </button>
            <p v-if="missedDisabledReason" class="sd-popup__hint">
              <!-- {{ missedButtonLabel }} -->
              {{ missedDisabledReason }}
            
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="missedConfirm" class="sd-overlay" @click.self="closeMissedConfirm">
        <div class="sd-remove">
          <div class="sd-remove_head">
            Mark {{ selectedLead?.firstName }} {{ selectedLead?.lastName }} as missed a call?
            This will start the automation in ActiveCampaign.
          </div>

          <p v-if="missedError" class="sd-remove_error">{{ missedError }}</p>

          <div class="sd-remove_body">
            <button class="accept" :disabled="missedLoading" @click="submitMissedCall">
              <span v-if="missedLoading" class="sd-spinner sd-spinner--danger"></span>
              <span v-else>Yes</span>
            </button>
            <button class="cancel" :disabled="missedLoading" @click="closeMissedConfirm">
              No
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>

// ── Variables ────────────────────────────────────────────


const loading = ref(false)
const leads = ref([])
const selectedLead = ref(null)
const missedConfirm = ref(false)
const missedLoading = ref(false)
const missedError = ref('')

// ── State ──────────────────────────────────────────────
const leadSearch = ref('')
const globalLeadFilter = ref('all')

const leadFilters = [
  { val: 'all', label: 'All' },
  { val: 'NEW', label: 'New' },
  { val: 'BOOKED', label: 'Booked' },
  { val: 'CLOSED_WON', label: 'Closed Won' },
  { val: 'NO_SHOW', label: 'No Show' },
  { val: 'CANCELLED', label: 'Cancelled' },
  { val: 'RESCHEDULED', label: 'Rescheduled' },
  { val: 'SHOWED_NO_CLOSE', label: 'Showed No Close' },
  { val: 'UNQUALIFIED_ON_CALL', label: 'Unqualified On Call' },
  { val: 'DISQUALIFIED_QUIZ', label: 'Disqualified Quiz' },
]

function openLead(lead) { selectedLead.value = lead }
function removeLead(lead) { removeLeadData.value = lead }
function closeLead() { 
  selectedLead.value = null,
  missedConfirm.value = false,
  missedError.value = ''
}

function closeMissedConfirm() {
  if (missedLoading.value) return
  missedConfirm.value = false
  missedError.value = ''
}

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?'
}

function formatDateTime(d) {
  if (!d) return 'Not scheduled'
  return new Date(d).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const missedDisabledReason = computed(() => {
  // const lead = selectedLead.value
  // if (!lead) return ''
  // if (lead.status === 'NO_SHOW') return 'Already marked as missed'
  // if (!lead.callScheduledFor) return 'Call has not been scheduled'
  // if (new Date(lead.callScheduledFor) > new Date()) return 'Call has not happened yet'
  return ''
})

async function submitMissedCall() {
  if (missedLoading.value || missedDisabledReason.value) return

  missedLoading.value = true
  missedError.value = ''

  try {
    const updated = await $fetch(
      `/api/admin/leads/${selectedLead.value.id}/missed-call`,
      { method: 'POST' }
    )
    Object.assign(selectedLead.value, updated)
    missedConfirm.value = false
  } catch (e) {
    missedError.value = e?.data?.statusMessage || 'Something went wrong. Try again.'
  } finally {
    missedLoading.value = false
  }
}

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
  const map = {
    NEW: 'New',
    BOOKED: 'Booked',
    CLOSED_WON: 'Closed Won',
    NO_SHOW: 'No Show',
    CANCELLED: 'Cancelled',
    RESCHEDULED: 'Rescheduled',
    SHOWED_NO_CLOSE: 'Showed No Close',
    UNQUALIFIED_ON_CALL: 'Unqualified On Call',
    DISQUALIFIED_QUIZ: 'Disqualified Quiz',
  }
  return map[s] || s
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

<style scoped lang="scss">

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
  overflow-x: auto; 
  box-shadow: var(--shadow-card);
  -webkit-overflow-scrolling: touch;
}

.ad-table--full { min-width: 1000px; }

.ad-leads-filter { flex-wrap: wrap; }

@media (max-width: 640px) {
  .ad-head-controls { width: 100%; }
  .ad-input { width: 100%; }
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

/* Overlay */
.sd-overlay {
  position: fixed;
  inset: 0;
  background:rgba(0,51,35,.35);
  backdrop-filter:blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.sd-popup {
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  animation: popIn .2s ease;
  border:none;
  box-shadow:
      0 30px 70px rgba(0,51,35,.18);

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
  border: 1px solid #e8e0f0;
  background: var(--soft-white);
  color: #999;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}

.sd-popup__close:hover {
  border-color: #480074;
  color: #480074;
  background: #f0ebf8;
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
 background: linear-gradient(
    135deg,
    var(--emerald-green) 0%,
    var(--dark-green) 100%
  );
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow:
    0 12px 28px rgba(0, 51, 35, .12),
    0 0 0 6px rgba(0, 221, 120, .06);
}

.sd-popup__name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 6px;
  font-family:var(--font-aeonik, sans-serif);
  color:var(--dark-green);

}

.sd-popup__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.sd-popup__field {
  background: var(--soft-white);
  border: 1px solid #e8e0f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.sd-popup__field-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.sd-popup__field-val {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.sd-popup__answers-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e0f0;
}

.sd-answer {
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  background: var(--soft-white);
  border:1px solid var(--gray-2);
  transition:.25s;
}

.sd-answer__q {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sd-answer__num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  background:var(--dark-green);
  color:white;
}

.sd-answer__a {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a2e;
  padding-left: 32px;
}

.sd-remove {
  background: white;
  border-radius: 15px;
  border: 1px solid #e8e0f0;
  color: #999;
  font-size: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;

  &_head {

    font-size: clamp(0.8rem, 1.5vw, 1.2rem);
    font-weight: 600;
  }

  &_body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    gap: 12px;

    button {
      flex: 1;
      border: 1px solid #e8e0f0;
      border-radius: 5px;
      padding: 7px 0;
      font-size: 12px;
      cursor: pointer;
      transition: all ease .3s;
      color: black
    }

    .accept {

      background: rgb(225, 0, 77, 0.15);

      &:hover {
        background: rgb(225, 0, 77, 0.75);
        transition: all ease .3s;
        color: white

      }

    }

    .cancel {

      background: rgb(0, 0, 0, 0.03);

      &:hover {
        background: rgb(0, 0, 0, 0.15);
        transition: all ease .3s;
      }

    }

  }

  
}

.sd-badge--no_show { background: #fff0f3; color: #dc2626; border: 1px solid #fecdd3; }

.sd-popup__actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e0f0;
}

.sd-missed {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--danger);
  background: transparent;
  color: var(--danger);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;

  &:hover:not(:disabled) {
    background: var(--danger);
    color: white;
  }

  &:disabled {
    opacity: .45;
    cursor: not-allowed;
  }
}

.sd-popup__hint {
  margin: 8px 0 0;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.sd-remove_error {
  margin: 0;
  font-size: 13px;
  color: var(--danger);
}

.sd-remove_body button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.sd-remove_body .accept {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
}

.sd-spinner--danger {
  border-color: rgba(225, 0, 77, .25);
  border-top-color: #e1004d;
}
</style>