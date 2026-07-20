<template>
  <div class="admin-dashboard">
    <!-- HEADER -->
    <header class="ad-header">
      <div class="head-container">
         <div class="ad-header__logo">
        <span class="ad-header__dot"></span>
        <span>Admin</span>
      </div>
      <div class="ad-header__actions">
        <button class="ad-refresh" @click="fetchAll" :disabled="loading">
          <span :class="{ 'ad-refresh--spin': loading }">↻</span>
          Refresh
        </button>
      </div>

      </div>
     
    </header>

    <main class="ad-main">
      <!-- TABS -->
      <nav class="ad-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ad-tabs__btn"
          :class="{ 'ad-tabs__btn--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.icon }}</span>
          {{ tab.label }}
          <span v-if="tab.count !== null" class="ad-tabs__badge">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- ═══ TAB: ПРОДАВЦЫ ═══ -->
      <section v-if="activeTab === 'sellers'" class="ad-section">
        <div class="ad-section__head">
          <div>
            <h2 class="ad-section__title">Sellers</h2>
            <p class="ad-section__sub">All sellers and their leads</p>
          </div>
          <div class="ad-search">
            <input
              v-model="sellerSearch"
              class="ad-input"
              placeholder="Поиск продавца..."
            />
          </div>
        </div>

        <div v-if="loading" class="ad-loading">
          <span class="ad-spinner"></span> Loading...
        </div>

        <div v-else class="ad-sellers-grid">
          <div
            v-for="seller in filteredSellers"
            :key="seller.id"
            class="ad-seller-card"
            :class="{ 'ad-seller-card--active': expandedSeller === seller.id }"
          >
            <!-- Карточка продавца -->
            <div class="ad-seller-card__header" @click="toggleSeller(seller.id)">
              <div class="ad-seller-card__left">
                <div class="ad-avatar" :style="{ background: sellerColor(seller.id) }">
                  {{ initials(seller.name, seller.surname) }}
                </div>
                <div>
                  <div class="ad-seller-card__name">{{ seller.name }} {{ seller.surname }}</div>
                  <div class="ad-seller-card__email">{{ seller.email }}</div>
                </div>
              </div>
              <div class="ad-seller-card__stats">
                <div class="ad-stat">
                  <div class="ad-stat__val">{{ seller.leads.length }}</div>
                  <div class="ad-stat__lbl">leads</div>
                </div>
                <div class="ad-stat ad-stat--green">
                  <div class="ad-stat__val">{{ seller.leads.filter(l => l.status === 'COMPLETED').length }}</div>
                  <div class="ad-stat__lbl">completed</div>
                </div>
                <div class="ad-stat ad-stat--accent">
                  <div class="ad-stat__val">{{ sellerEfficiency(seller) }}%</div>
                  <div class="ad-stat__lbl">efficiency</div>
                </div>
                <span class="ad-seller-card__chevron" :class="{ 'ad-seller-card__chevron--open': expandedSeller === seller.id }">
                  ›
                </span>
              </div>
            </div>

            <!-- Список лидов продавца (раскрывается) -->
            <div v-if="expandedSeller === seller.id" class="ad-seller-card__leads">
              <div
                v-if="seller.leads.length === 0"
                class="ad-empty-small"
              >
                No assigned leads
              </div>

              <div class="ad-leads-filter">
                <button
                  v-for="f in leadFilters"
                  :key="f.val"
                  class="ad-filter-btn"
                  :class="{ 'ad-filter-btn--active': leadFilter === f.val }"
                  @click="leadFilter = f.val"
                >
                  {{ f.label }}
                </button>
              </div>

              <table class="ad-table" v-if="filteredSellerLeads(seller).length > 0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Source</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="lead in filteredSellerLeads(seller)"
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
                    <td>
                      <span class="ad-tag">{{ lead.utmSource || 'direct' }}</span>
                    </td>
                    <td class="ad-table__date">{{ formatDate(lead.createdAt) }}</td>
                    <td>
                      <button class="ad-eye-btn" @click.stop="openLead(lead)">👁</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="ad-empty-small">No leads with the selected filter</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ TAB: ВСЕ ЛИДЫ ═══ -->
      <section v-if="activeTab === 'leads'" class="ad-section">
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
                    {{ lead.seller.name }} {{ lead.seller.surname }}
                  </div>
                  <span v-else class="ad-unassigned">Не закреплён</span>
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
                <td class="ad-table__date">{{ formatDate(lead.createdAt) }}</td>
                <td>
                  <button class="ad-eye-btn" @click="openLead(lead)">👁</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ═══ TAB: АНАЛИТИКА ═══ -->
      <section v-if="activeTab === 'analytics'" class="ad-section">
        <div class="ad-section__head">
          <h2 class="ad-section__title">Analytics</h2>
          <p class="ad-section__sub">Overall system statistics</p>
        </div>

        <div v-if="loading" class="ad-loading">
          <span class="ad-spinner"></span> Loading...
        </div>

        <div v-else class="ad-analytics">
          <!-- Метрики -->
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
            <!-- Завершаемость — доnut -->
            <div class="ad-chart-box">
              <h3 class="ad-chart-title">Quiz completion</h3>
              <div class="ad-donut-wrap">
                <svg viewBox="0 0 140 140" class="ad-donut" xmlns="http://www.w3.org/2000/svg">
                  <!-- Фоновое кольцо -->
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#1e2433" stroke-width="16"/>
                  <!-- Покинули -->
                  <circle
                    cx="70" cy="70" r="54"
                    fill="none" stroke="#ff4d6d" stroke-width="16"
                    stroke-dasharray="339.29"
                    :stroke-dashoffset="abandonedOffset"
                    stroke-linecap="round"
                    transform="rotate(-90 70 70)"
                  />
                  <!-- Завершили -->
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

            <!-- Дропаут по шагам -->
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

            <!-- Лиды по продавцам — горизонтальный бар -->
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
                        :style="{
                          width: barWidth(s.totalLeads),
                          background: sellerColor(s.id)
                        }"
                        :title="`Total: ${s.totalLeads}`"
                      ></div>
                    </div>
                    <div class="ad-bar-chart__track ad-bar-chart__track--thin">
                      <div
                        class="ad-bar-chart__fill"
                        :style="{
                          width: barWidth(s.completedLeads),
                          background: '#22d67a'
                        }"
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

            <!-- Эффективность продавцов -->
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
                        :style="{
                          width: s.efficiency + '%',
                          background: efficiencyColor(s.efficiency)
                        }"
                      ></div>
                    </div>
                    <span
                      class="ad-efficiency__pct"
                      :style="{ color: efficiencyColor(s.efficiency) }"
                    >
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

            <!-- UTM источники -->
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
                    <div
                      class="ad-utm__fill"
                      :style="{ width: utmWidth(count) }"
                    ></div>
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
    </main>

    <!-- ═══ POPUP: Детали лида ═══ -->
    <Teleport to="body">
      <div v-if="selectedLead" class="ad-overlay" @click.self="closeLead">
        <div class="ad-popup">
          <button class="ad-popup__close" @click="closeLead">✕</button>

          <div class="ad-popup__header">
            <div class="ad-avatar ad-avatar--lg">
              {{ initials(selectedLead.firstName, selectedLead.lastName) }}
            </div>
            <div>
              <h2 class="ad-popup__name">
                {{ selectedLead.firstName || 'No name' }} {{ selectedLead.lastName || '' }}
              </h2>
              <div class="ad-popup__badges">
                <span class="ad-badge" :class="`ad-badge--${selectedLead.status.toLowerCase()}`">
                  {{ statusLabel(selectedLead.status) }}
                </span>
                <span v-if="selectedLead.seller" class="ad-badge ad-badge--seller">
                  {{ selectedLead.seller.name }} {{ selectedLead.seller.surname }}
                </span>
                <span v-else class="ad-badge ad-badge--none">No salesperson</span>
              </div>
            </div>
          </div>

          <div class="ad-popup__grid">
            <div class="ad-popup__field">
              <div class="ad-popup__field-lbl">📞 Phone</div>
              <div class="ad-popup__field-val">{{ selectedLead.phone || '—' }}</div>
            </div>
            <div class="ad-popup__field">
              <div class="ad-popup__field-lbl">✉️ Email</div>
              <div class="ad-popup__field-val">{{ selectedLead.email || '—' }}</div>
            </div>
            <div class="ad-popup__field">
              <div class="ad-popup__field-lbl">📅 Date</div>
              <div class="ad-popup__field-val">{{ formatDate(selectedLead.createdAt) }}</div>
            </div>
            <div class="ad-popup__field">
              <div class="ad-popup__field-lbl">📍 UTM Source</div>
              <div class="ad-popup__field-val">{{ selectedLead.utmSource || 'direct' }}</div>
            </div>
            <div class="ad-popup__field" v-if="selectedLead.utmCampaign">
              <div class="ad-popup__field-lbl">🎯 Campaign</div>
              <div class="ad-popup__field-val">{{ selectedLead.utmCampaign }}</div>
            </div>
            <div class="ad-popup__field" v-if="selectedLead.utmMedium">
              <div class="ad-popup__field-lbl">📢 Medium</div>
              <div class="ad-popup__field-val">{{ selectedLead.utmMedium }}</div>
            </div>
            <div class="ad-popup__field" v-if="selectedLead.utmTerm">
              <div class="ad-popup__field-lbl">🔍 Term</div>
              <div class="ad-popup__field-val">{{ selectedLead.utmTerm }}</div>
            </div>
            <div class="ad-popup__field" v-if="selectedLead.utmContent">
              <div class="ad-popup__field-lbl">📄 Content</div>
              <div class="ad-popup__field-val">{{ selectedLead.utmContent }}</div>
            </div>
          </div>

          <!-- Прогресс квиза -->
          <div class="ad-popup__progress">
            <div class="ad-popup__progress-label">
              Quiz Progress: {{ selectedLead.answers?.length || 0 }}/5 answers
            </div>
            <div class="ad-popup__progress-bar">
              <div
                class="ad-popup__progress-fill"
                :style="{ width: ((selectedLead.answers?.length || 0) / 5 * 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Ответы -->
          <div class="ad-popup__answers">
            <h3 class="ad-popup__answers-title">Answers to Quiz</h3>
            <div
              v-if="!selectedLead.answers?.length"
              class="ad-empty-small"
            >
              No answers available
            </div>
            <div
              v-for="ans in selectedLead.answers"
              :key="ans.id"
              class="ad-answer"
            >
              <div class="ad-answer__q">
                <span class="ad-answer__num">{{ ans.questionId }}</span>
                {{ ans.question }}
              </div>
              <div class="ad-answer__a">{{ ans.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>

// ── State ──────────────────────────────────────────────
const activeTab = ref('sellers')
const loading = ref(false)

const sellers = ref([])
const allLeads = ref([])
const analytics = ref(null)

const expandedSeller = ref(null)
const selectedLead = ref(null)

const sellerSearch = ref('')
const leadSearch = ref('')
const leadFilter = ref('all')
const globalLeadFilter = ref('all')

// ── Tabs ──────────────────────────────────────────────
const tabs = computed(() => [
  { id: 'sellers', label: 'Sellers', icon: '🧑‍💼', count: sellers.value.length },
  { id: 'leads', label: 'All Leads', icon: '👥', count: allLeads.value.length },
  { id: 'analytics', label: 'Analytics', icon: '📊', count: null },
])

const leadFilters = [
  { val: 'all', label: 'All' },
  { val: 'COMPLETED', label: 'Completed' },
  { val: 'ABANDONED', label: 'Abandoned' },
  { val: 'IN_PROGRESS', label: 'In Progress' },
]

// ── Computed ──────────────────────────────────────────
const filteredSellers = computed(() => {
  const q = sellerSearch.value.toLowerCase()
  if (!q) return sellers.value
  return sellers.value.filter(s =>
    (s.name + ' ' + s.surname + ' ' + s.email).toLowerCase().includes(q)
  )
})

const filteredAllLeads = computed(() => {
  let list = allLeads.value
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

const completionRate = computed(() => {
  const t = analytics.value?.total || 0
  const c = analytics.value?.completed || 0
  if (!t) return 0
  return Math.round((c / t) * 100)
})

// SVG donut offsets (circumference = 2π×54 ≈ 339.29)
const CIRC = 339.29
const completedOffset = computed(() => {
  const t = analytics.value?.total || 0
  const c = analytics.value?.completed || 0
  if (!t) return CIRC
  return CIRC - (c / t) * CIRC
})
const abandonedOffset = computed(() => {
  const t = analytics.value?.total || 0
  const a = analytics.value?.abandoned || 0
  if (!t) return CIRC
  // abandoned arc starts after completed arc
  const completedAngle = ((analytics.value?.completed || 0) / t) * CIRC
  return CIRC - (a / t) * CIRC
})

const sortedByEfficiency = computed(() => {
  return (analytics.value?.sellerStats || [])
    .map((s) => ({
      ...s,
      efficiency: s.totalLeads ? Math.round((s.completedLeads / s.totalLeads) * 100) : 0,
    }))
    .sort((a, b) => b.efficiency - a.efficiency)
})

// ── Methods ───────────────────────────────────────────
function filteredSellerLeads(seller) {
  let list = seller.leads
  if (leadFilter.value !== 'all') list = list.filter((l) => l.status === leadFilter.value)
  return list
}

function sellerEfficiency(seller) {
  if (!seller.leads.length) return 0
  return Math.round((seller.leads.filter((l) => l.status === 'COMPLETED').length / seller.leads.length) * 100)
}

function toggleSeller(id) {
  expandedSeller.value = expandedSeller.value === id ? null : id
}

function openLead(lead) { selectedLead.value = lead }
function closeLead() { selectedLead.value = null }

// ── Chart helpers ─────────────────────────────────────
function dropoffWidth(step) {
  const map = analytics.value?.dropoffByStep || {}
  const max = Math.max(...Object.values(map), 1)
  const val = map[step] || 0
  return Math.round((val / max) * 100) + '%'
}

function barWidth(count) {
  const max = Math.max(...(analytics.value?.sellerStats || []).map((s) => s.totalLeads), 1)
  return Math.round((count / max) * 100) + '%'
}

function utmWidth(count) {
  const max = Math.max(...Object.values(analytics.value?.utmSources || {}), 1)
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

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusLabel(s) {
  return { COMPLETED: 'Completed', ABANDONED: 'Abandoned', IN_PROGRESS: 'In progress' }[s] || s
}

// ── Fetch ─────────────────────────────────────────────
async function fetchAll() {
  loading.value = true
  try {
    const [s, l, a] = await Promise.all([
      $fetch('/api/sellers'),
      $fetch('/api/leads'),
      $fetch('/api/analytics'),
    ])
    sellers.value = s
    allLeads.value = l
    analytics.value = a
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

watch(activeTab, () => {
  if (!analytics.value) fetchAll()
})

definePageMeta({
  layout: "admin",
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ════════════════════════════════════════════
   ADMIN DASHBOARD
   Palette: deep navy + vivid multi-accent
════════════════════════════════════════════ */
.admin-dashboard {
  /* --bg: #080c14;
  --bg-2: #0f1521;
  --bg-3: #161e2e;
  --bg-4: #1e2840;
  --border: #1e2d45;
  --text: #e2e8f4;
  --text-muted: #7a8ba4;
  --accent: #00e5c7; */
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
  --font: 'DM Sans', 'Segoe UI', sans-serif;

  font-family: var(--font);
  background: transparent;
  color: var(--text);
  min-height: 100vh;
}

/* ── Header ── */
.ad-header {
  display: block;
  padding: 14px 20px;
  background: #481474;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.head-container {
display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: var(--bg);
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.ad-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: .03em;
}

.ad-header__dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #7c3aed;
  box-shadow: 0 0 10px #7c3aed;
  animation: pulse 2s infinite;
}

@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.ad-refresh {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-3);
  color: var(--text-muted);
  font-family: var(--font);
  font-size: 13px;
  cursor: pointer;
  transition: all .2s;
}

.ad-refresh:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.ad-refresh:disabled { opacity: .5; cursor: not-allowed; }
.ad-refresh--spin { display: inline-block; animation: spin .7s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Main ── */
.ad-main {
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* ── Tabs ── */
.ad-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: var(--bg-2);
  padding: 5px;
  border-radius: 12px;
  border: 1px solid var(--border);
  width: fit-content;
}

.ad-tabs__btn {
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

.ad-tabs__btn:hover { color: var(--text); background: var(--bg-3); }

.ad-tabs__btn--active {
  background: #7c3aed !important;
  color: #fff !important;
  font-weight: 600;
}

.ad-tabs__badge {
  background: rgba(255,255,255,.15);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}

/* ── Section ── */
.ad-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}

.ad-section__title { font-size: 20px; font-weight: 700; color: var(--bg); margin: 0 0 4px; }
.ad-section__sub { font-size: 13px; color: var(--bg); margin: 0; }

.ad-head-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

/* ── Search ── */
.ad-search { position: relative; }

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
  transition: border-color .2s;
}

.ad-input:focus { border-color: var(--accent); }
.ad-input::placeholder { color: var(--text-muted); }

/* ── Filters ── */
.ad-leads-filter { display: flex; gap: 4px; }
.ad-leads-filter--inline { }

.ad-filter-btn {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--text-muted);
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
}

.ad-filter-btn:hover { color: var(--text); }

.ad-filter-btn--active {
  background: var(--bg-4);
  border-color: var(--accent);
  color: var(--accent);
}

/* ── Loading / Empty ── */
.ad-loading { display: flex; align-items: center; gap: 10px; color: var(--text-muted); padding: 40px 0; font-size: 14px; }
.ad-spinner { width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: #7c3aed; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
.ad-empty { text-align: center; padding: 60px 0; color: var(--text-muted); }
.ad-empty span { font-size: 36px; display: block; margin-bottom: 10px; }
.ad-empty p { font-size: 14px; margin: 0; }
.ad-empty-small { color: var(--text-muted); font-size: 13px; padding: 16px 0; text-align: center; }

/* ── Avatar ── */
.ad-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ad-avatar--sm { width: 30px; height: 30px; font-size: 11px; }
.ad-avatar--lg { width: 58px; height: 58px; font-size: 18px; }

/* ── Seller Cards ── */
.ad-sellers-grid { display: flex; flex-direction: column; gap: 12px; }

.ad-seller-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .2s;
}

.ad-seller-card--active { border-color: #7c3aed; }

.ad-seller-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  cursor: pointer;
  transition: background .15s;
  gap: 16px;
}

.ad-seller-card__header:hover { background: var(--bg-3); }

.ad-seller-card__left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.ad-seller-card__name { font-size: 15px; font-weight: 600; }
.ad-seller-card__email { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

.ad-seller-card__stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.ad-stat { text-align: center; min-width: 50px; }
.ad-stat__val { font-size: 20px; font-weight: 700; line-height: 1; }
.ad-stat__lbl { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.ad-stat--green .ad-stat__val { color: #22d67a; }
.ad-stat--accent .ad-stat__val { color: #7c3aed; }

.ad-seller-card__chevron {
  font-size: 22px;
  color: var(--text-muted);
  transition: transform .2s;
  line-height: 1;
}

.ad-seller-card__chevron--open { transform: rotate(90deg); }

.ad-seller-card__leads {
  border-top: 1px solid var(--border);
  padding: 16px 20px;
  background: var(--bg);
}

/* ── Table ── */
.ad-table-wrap { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }

.ad-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.ad-table--full { }

.ad-table thead { background: var(--bg-2); }

.ad-table th {
  padding: 11px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.ad-table__row { border-bottom: 1px solid var(--border); transition: background .15s; }
.ad-table__row:last-child { border-bottom: none; }
.ad-table__row:hover { background: var(--bg-2); cursor: pointer; }

.ad-table td { padding: 11px 14px; vertical-align: middle; }
.ad-table__name { font-weight: 500; }
.ad-table__date { color: var(--text-muted); font-size: 12px; white-space: nowrap; }

/* ── Mini progress ── */
.ad-mini-progress { display: flex; align-items: center; gap: 8px; }

.ad-mini-progress__track {
  width: 60px; height: 4px;
  background: var(--bg-4);
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.ad-mini-progress__fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width .3s;
}

.ad-mini-progress span { font-size: 11px; color: var(--text-muted); }

/* ── Tag ── */
.ad-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: var(--bg-3);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

/* ── Badge ── */
.ad-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  white-space: nowrap;
}

.ad-badge--completed { background: #22d67a1a; color: #22d67a; border: 1px solid #22d67a40; }
.ad-badge--abandoned { background: #ff4d6d1a; color: #ff4d6d; border: 1px solid #ff4d6d40; }
.ad-badge--in_progress { background: #f59e0b1a; color: #f59e0b; border: 1px solid #f59e0b40; }
.ad-badge--seller { background: #7c3aed1a; color: #a78bfa; border: 1px solid #7c3aed40; }
.ad-badge--none { background: var(--bg-3); color: var(--text-muted); border: 1px solid var(--border); }

/* ── Seller chip ── */
.ad-seller-chip { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.ad-seller-chip__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ad-unassigned { font-size: 12px; color: var(--text-muted); }

/* ── Eye button ── */
.ad-eye-btn {
  width: 30px; height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-3);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}

.ad-eye-btn:hover { border-color: var(--accent); }

/* ── Analytics ── */
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

.ad-metric--green { border-color: #22d67a40; }
.ad-metric--red { border-color: #ff4d6d40; }
.ad-metric--yellow { border-color: #f59e0b40; }
.ad-metric--blue { border-color: #3b82f640; }
.ad-metric--orange { border-color: #f9731640; }

.ad-metric__icon { font-size: 22px; margin-bottom: 8px; }

.ad-metric__val {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
}

.ad-metric--green .ad-metric__val { color: #22d67a; }
.ad-metric--red .ad-metric__val { color: #ff4d6d; }
.ad-metric--yellow .ad-metric__val { color: #f59e0b; }
.ad-metric--blue .ad-metric__val { color: #60a5fa; }
.ad-metric--orange .ad-metric__val { color: #fb923c; }

.ad-metric__lbl { font-size: 12px; color: var(--text-muted); }

/* ── Charts grid ── */
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

.ad-chart-box--wide { grid-column: 1 / -1; }

.ad-chart-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 18px;
}

/* Donut */
.ad-donut-wrap { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
.ad-donut { width: 150px; height: 150px; flex-shrink: 0;}
.ad-donut__pct { font-size: 24px; font-weight: 700; fill: var(--text); font-family: 'DM Sans', sans-serif;  }
.ad-donut__sub { font-size: 10px; fill: #7a8ba4; font-family: 'DM Sans', sans-serif; }
.ad-donut-legend { display: flex; flex-direction: column; gap: 10px; }
.ad-legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
.ad-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* Funnel */
.ad-funnel { display: flex; flex-direction: column; gap: 14px; }
.ad-funnel__row { display: grid; grid-template-columns: 55px 1fr 32px; align-items: center; gap: 10px; }
.ad-funnel__label { font-size: 12px; color: var(--text-muted); }
.ad-funnel__track { background: var(--bg-3); border-radius: 4px; height: 10px; overflow: hidden; }
.ad-funnel__fill { height: 100%; background: linear-gradient(90deg, #ff4d6d, #ff8fa3); border-radius: 4px; transition: width .6s; }
.ad-funnel__count { font-size: 12px; color: var(--text-muted); text-align: right; }

/* Bar chart sellers */
.ad-bar-chart { display: flex; flex-direction: column; gap: 16px; }

.ad-bar-chart__row { display: grid; grid-template-columns: 160px 1fr 100px; align-items: center; gap: 16px; }

.ad-bar-chart__seller { display: flex; align-items: center; gap: 8px; font-size: 13px; overflow: hidden; }
.ad-bar-chart__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.ad-bar-chart__bars { display: flex; flex-direction: column; gap: 5px; }
.ad-bar-chart__track { background: var(--bg-3); border-radius: 4px; height: 8px; overflow: hidden; }
.ad-bar-chart__track--thin { height: 5px; }
.ad-bar-chart__fill { height: 100%; border-radius: 4px; transition: width .6s; }

.ad-bar-chart__nums { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
.ad-bar-chart__total { color: var(--text-muted); }
.ad-bar-chart__completed { color: #22d67a; }

.ad-bar-chart__legend { display: flex; gap: 20px; font-size: 12px; color: var(--text-muted); padding-top: 8px; border-top: 1px solid var(--border); }

/* Efficiency */
.ad-efficiency { display: flex; flex-direction: column; gap: 16px; }

.ad-efficiency__row { display: grid; grid-template-columns: 180px 1fr 100px; align-items: center; gap: 16px; }

.ad-efficiency__seller { display: flex; align-items: center; gap: 10px; font-size: 13px; overflow: hidden; }

.ad-efficiency__bar-wrap { display: flex; align-items: center; gap: 10px; }
.ad-efficiency__track { flex: 1; background: var(--bg-3); border-radius: 4px; height: 10px; overflow: hidden; }
.ad-efficiency__fill { height: 100%; border-radius: 4px; transition: width .6s; }
.ad-efficiency__pct { font-size: 14px; font-weight: 700; min-width: 40px; text-align: right; }
.ad-efficiency__meta { font-size: 12px; color: var(--text-muted); text-align: right; }

/* UTM */
.ad-utm { display: flex; flex-direction: column; gap: 12px; }
.ad-utm__row { display: grid; grid-template-columns: 90px 1fr 32px 40px; align-items: center; gap: 10px; }
.ad-utm__label { font-size: 12px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ad-utm__track { background: var(--bg-3); border-radius: 4px; height: 8px; overflow: hidden; }
.ad-utm__fill { height: 100%; background: linear-gradient(90deg, var(--accent), #00a8ff); border-radius: 4px; transition: width .6s; }
.ad-utm__count { font-size: 12px; color: var(--text-muted); text-align: right; }
.ad-utm__pct { font-size: 12px; color: var(--text-muted); text-align: right; }

/* ── Popup ── */
.ad-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.ad-popup {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  position: relative;
  animation: popIn .2s ease;
}

@keyframes popIn { from{transform:scale(.95);opacity:0} to{transform:scale(1);opacity:1} }

.ad-popup__close {
  position: absolute;
  top: 16px; right: 16px;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-3);
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}

.ad-popup__close:hover { border-color: #ff4d6d; color: #ff4d6d; }

.ad-popup__header { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
.ad-popup__name { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
.ad-popup__badges { display: flex; gap: 6px; flex-wrap: wrap; }

.ad-popup__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.ad-popup__field {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
}

.ad-popup__field-lbl {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.ad-popup__field-val { font-size: 14px; font-weight: 500; }

.ad-popup__progress { margin-bottom: 22px; }

.ad-popup__progress-label { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }

.ad-popup__progress-bar {
  height: 6px;
  background: var(--bg-3);
  border-radius: 3px;
  overflow: hidden;
}

.ad-popup__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #00a8ff);
  border-radius: 3px;
  transition: width .4s;
}

.ad-popup__answers-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.ad-answer {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 10px;
}

.ad-answer__q {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.ad-answer__num {
  width: 22px; height: 22px;
  background: #7c3aed1a;
  color: #a78bfa;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ad-answer__a { font-size: 15px; font-weight: 500; padding-left: 32px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .ad-charts-grid { grid-template-columns: 1fr; }
  .ad-chart-box--wide { grid-column: 1; }
  .ad-bar-chart__row { grid-template-columns: 120px 1fr 80px; }
  .ad-efficiency__row { grid-template-columns: 140px 1fr 80px; }
  .ad-popup__grid { grid-template-columns: 1fr; }
  .ad-seller-card__stats { gap: 12px; }
  .ad-tabs { flex-wrap: wrap; width: 100%; }
}
</style>
