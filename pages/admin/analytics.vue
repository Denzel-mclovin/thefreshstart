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
        <div class="ad-metric ad-metric--dark">
          <div class="ad-metric__icon">🏷️</div>
          <div class="ad-metric__val">{{ analytics?.assigned || 0 }}</div>
          <div class="ad-metric__lbl">Assigned</div>
        </div>
        <div class="ad-metric ad-metric--neutral">
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
              <circle cx="70" cy="70" r="54" fill="none" style="stroke: var(--chart-track)" stroke-width="16"/>
              <circle
                cx="70" cy="70" r="54"
                fill="none" style="stroke: var(--danger)" stroke-width="16"
                stroke-dasharray="339.29"
                :stroke-dashoffset="abandonedOffset"
                stroke-linecap="round"
                transform="rotate(-90 70 70)"
              />
              <circle
                cx="70" cy="70" r="54"
                fill="none" style="stroke: var(--emerald-green)" stroke-width="16"
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
                <span class="ad-legend-dot" style="background:var(--emerald-green)"></span>
                Completed ({{ analytics?.completed || 0 }})
              </div>
              <div class="ad-legend-item">
                <span class="ad-legend-dot" style="background:var(--danger)"></span>
                Abandoned ({{ analytics?.abandoned || 0 }})
              </div>
              <div class="ad-legend-item">
                <span class="ad-legend-dot" style="background:var(--warning)"></span>
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
                    :style="{ width: barWidth(s.completedLeads), background: 'var(--emerald-green)' }"
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
              <span><span class="ad-legend-dot" style="background:var(--text-muted);width:12px;height:4px;border-radius:2px;display:inline-block;margin-right:6px;vertical-align:middle"></span>Total leads</span>
              <span><span class="ad-legend-dot" style="background:var(--emerald-green);width:12px;height:4px;border-radius:2px;display:inline-block;margin-right:6px;vertical-align:middle"></span>Completed quiz</span>
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
                <div class="ad-avatar ad-avatar--sm" :style="{ borderColor: sellerColor(s.id) }">
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
                <span class="ad-efficiency__pct" :style="{ color: efficiencyTextColor(s.efficiency) }">
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

    <!-- ═══ Ads, funnel & sales: backed by /api/analytics/* and /api/meta/sync ═══ -->
    <div class="ad-mkt">
      <div>
        <h2 class="ad-mkt__title">Ads, funnel &amp; sales</h2>
        <p class="ad-mkt__sub">Meta spend matched against leads, bookings and payments</p>
      </div>

      <div class="ad-toolbar">
        <label class="ad-field">
          <span>From</span>
          <input v-model="filters.from" type="date" :max="filters.to" />
        </label>
        <label class="ad-field">
          <span>To</span>
          <input v-model="filters.to" type="date" :min="filters.from" />
        </label>
        <div class="ad-seg">
          <button
            v-for="g in GRANULARITIES"
            :key="g.value"
            type="button"
            class="ad-seg__btn"
            :class="{ 'is-active': filters.granularity === g.value }"
            @click="filters.granularity = g.value"
          >
            {{ g.label }}
          </button>
        </div>
        <div class="ad-sync">
          <span class="ad-sync__status" :class="syncStatusClass">{{ syncLabel }}</span>
          <button type="button" class="ad-btn" :disabled="syncing" @click="runSync">
            {{ syncing ? 'Syncing…' : 'Sync Meta for this range' }}
          </button>
        </div>
      </div>

      <!-- Funnel -->
      <div class="ad-chart-box">
        <div class="ad-box-head">
          <h3 class="ad-chart-title">Funnel</h3>
          <p class="ad-box-note">
            Four separate conversion steps, so you can see which one is failing, plus cost per
            acquisition. Weekly or monthly only — there is no lifetime figure on purpose.
          </p>
        </div>
        <div v-if="funnel.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="funnel.error" class="ad-state ad-state--error">{{ funnel.error }}</div>
        <div v-else-if="!funnel.data?.rows?.length" class="ad-empty-small">No data for this range</div>
        <div v-else class="ad-table-wrap">
          <table class="ad-table">
            <thead>
              <tr class="ad-table__group">
                <th></th>
                <th colspan="7">Counts</th>
                <th colspan="4">Conversion</th>
                <th colspan="3">Cost per acquisition</th>
              </tr>
              <tr>
                <th>Period</th>
                <th>Visits</th>
                <th>Quiz started</th>
                <th>Leads (Q4)</th>
                <th>Quiz done (Q5)</th>
                <th>Bookings</th>
                <th>Closes</th>
                <th>Ad spend</th>
                <th>Visit → start</th>
                <th>Start → lead</th>
                <th>Lead → finish</th>
                <th>Lead → booking</th>
                <th>Quiz complete</th>
                <th>Booking</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in funnel.data.rows" :key="r.period">
                <td>{{ fmtPeriod(r.period, funnel.data.granularity) }}</td>
                <td>{{ fmtNum(r.firstVisits) }}</td>
                <td>{{ fmtNum(r.quizStarts) }}</td>
                <td>{{ fmtNum(r.leadsCreated) }}</td>
                <td>{{ fmtNum(r.quizFinishes) }}</td>
                <td>{{ fmtNum(r.bookings) }}</td>
                <td>{{ fmtNum(r.closes) }}</td>
                <td>{{ fmtMoney(r.adSpend) }}</td>
                <td>{{ fmtPct(r.visitToQuizStart) }}</td>
                <td>{{ fmtPct(r.quizStartToLead) }}</td>
                <td>{{ fmtPct(r.leadToQuizFinish) }}</td>
                <td>{{ fmtPct(r.leadToBooking) }}</td>
                <td>{{ fmtMoney(r.cpaQuizComplete) }}</td>
                <td>{{ fmtMoney(r.cpaBooking) }}</td>
                <td>{{ fmtMoney(r.cpaClose) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cost per paid call -->
      <div class="ad-chart-box">
        <div class="ad-box-head">
          <h3 class="ad-chart-title">Cost per paid call</h3>
          <p class="ad-box-note">
            Ad spend ÷ calls that came from paid traffic only. Calls from the email list cost
            nothing in ads, so they are excluded.
          </p>
        </div>
        <div v-if="costPerCall.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="costPerCall.error" class="ad-state ad-state--error">{{ costPerCall.error }}</div>
        <div v-else-if="costPerCall.data && !costPerCall.data.available" class="ad-notice">
          <strong>Hidden on purpose.</strong> {{ costPerCall.data.reason }}
          A blended number (all spend ÷ all calls) would understate the real cost of a paid call.
        </div>
        <div v-else-if="!costPerCall.data?.rows?.length" class="ad-empty-small">No data for this range</div>
        <div v-else class="ad-table-wrap">
          <table class="ad-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Ad spend</th>
                <th>Paid calls booked</th>
                <th>Paid calls attended</th>
                <th>Cost / booked call</th>
                <th>Cost / attended call</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in costPerCall.data.rows" :key="r.period">
                <td>{{ fmtPeriod(r.period, filters.granularity) }}</td>
                <td>{{ fmtMoney(r.adSpend) }}</td>
                <td>{{ fmtNum(r.paidBookedCalls) }}</td>
                <td>{{ fmtNum(r.paidAttendedCalls) }}</td>
                <td class="is-strong">{{ fmtMoney(r.costPerBookedCall) }}</td>
                <td class="is-strong">{{ fmtMoney(r.costPerAttendedCall) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sales -->
      <div class="ad-chart-box">
        <div class="ad-box-head">
          <h3 class="ad-chart-title">Sales &amp; ROAS</h3>
          <p class="ad-box-note">
            Booked ROAS = contract value ÷ ad spend (does the offer work). Collected ROAS = cash
            collected ÷ ad spend (has the bank account caught up). Cash is the running total
            collected so far from clients closed in that period, so Affirm deals fill in over time.
          </p>
        </div>
        <div v-if="sales.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="sales.error" class="ad-state ad-state--error">{{ sales.error }}</div>
        <div v-else-if="!sales.data?.rows?.length" class="ad-empty-small">No data for this range</div>
        <div v-else class="ad-table-wrap">
          <table class="ad-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Booked</th>
                <th>Attended</th>
                <th>Closed</th>
                <th>Show-up rate</th>
                <th>Close rate</th>
                <th>Contract value</th>
                <th>Cash collected</th>
                <th>Ad spend</th>
                <th>Booked ROAS</th>
                <th>Collected ROAS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in sales.data.rows" :key="r.period">
                <td>{{ fmtPeriod(r.period, sales.data.granularity) }}</td>
                <td>{{ fmtNum(r.booked) }}</td>
                <td>{{ fmtNum(r.attended) }}</td>
                <td>{{ fmtNum(r.closed) }}</td>
                <td>{{ fmtPct(r.showUpRate) }}</td>
                <td>{{ fmtPct(r.closeRate) }}</td>
                <td>{{ fmtMoney(r.contractValueBooked) }}</td>
                <td>{{ fmtMoney(r.cashCollected) }}</td>
                <td>{{ fmtMoney(r.adSpend) }}</td>
                <td class="is-strong">{{ fmtRoas(r.bookedROAS) }}</td>
                <td class="is-strong">{{ fmtRoas(r.collectedROAS) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cohort ROAS -->
      <div class="ad-chart-box">
        <div class="ad-box-head ad-box-head--row">
          <div>
            <h3 class="ad-chart-title">Cohort ROAS (90 days)</h3>
            <p class="ad-box-note">
              Leads grouped by the week they were generated; revenue counted if the deal closed
              within 90 days of the lead. This compares spend and revenue for the same people.
              Always read the lead count first — a cohort with few leads is noise.
            </p>
          </div>
          <label class="ad-field">
            <span>Cohorts shown</span>
            <select v-model.number="cohortWeeks">
              <option v-for="w in COHORT_OPTIONS" :key="w" :value="w">Last {{ w }} weeks</option>
            </select>
          </label>
        </div>
        <div v-if="cohorts.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="cohorts.error" class="ad-state ad-state--error">{{ cohorts.error }}</div>
        <div v-else-if="!cohorts.data?.rows?.length" class="ad-empty-small">No cohorts yet</div>
        <div v-else class="ad-table-wrap">
          <table class="ad-table">
            <thead>
              <tr>
                <th>Cohort (week of)</th>
                <th>Leads</th>
                <th>Ad spend</th>
                <th>Closes ≤ 90d</th>
                <th>Contract value</th>
                <th>Cash collected</th>
                <th>Booked ROAS</th>
                <th>Collected ROAS</th>
                <th>Window</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in cohorts.data.rows" :key="r.cohortWeekStart" :class="{ 'is-low': r.leadCount < LOW_SAMPLE }">
                <td>{{ fmtPeriod(r.cohortWeekStart, 'week') }}</td>
                <td class="is-strong">
                  {{ fmtNum(r.leadCount) }}
                  <span v-if="r.leadCount < LOW_SAMPLE" class="ad-badge ad-badge--warn">low sample</span>
                </td>
                <td>{{ fmtMoney(r.adSpend) }}</td>
                <td>{{ fmtNum(r.closesWithin90d) }}</td>
                <td>{{ fmtMoney(r.contractValueWithin90d) }}</td>
                <td>{{ fmtMoney(r.cashCollectedWithin90d) }}</td>
                <td class="is-strong">{{ fmtRoas(r.bookedCohortROAS) }}</td>
                <td class="is-strong">{{ fmtRoas(r.collectedCohortROAS) }}</td>
                <td>
                  <span class="ad-badge" :class="r.cohortComplete ? 'ad-badge--ok' : 'ad-badge--open'">
                    {{ r.cohortComplete ? 'complete' : 'still open' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Q4 / Q5 segments -->
      <div v-for="block in segmentBlocks" :key="block.key" class="ad-chart-box">
        <div class="ad-box-head">
          <h3 class="ad-chart-title">{{ block.title }}</h3>
          <p class="ad-box-note">{{ block.note }}</p>
        </div>
        <div v-if="block.state.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="block.state.error" class="ad-state ad-state--error">{{ block.state.error }}</div>
        <div v-else-if="!block.state.data?.rows?.length" class="ad-empty-small">
          No answers recorded for this range
        </div>
        <div v-else class="ad-table-wrap">
          <table class="ad-table">
            <thead>
              <tr>
                <th>Answer</th>
                <th>Leads</th>
                <th>Booked</th>
                <th>Attended</th>
                <th>Closed</th>
                <th>Booking rate</th>
                <th>Show rate</th>
                <th>Close rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in block.state.data.rows" :key="r.answer">
                <td class="ad-table__answer">{{ r.answer }}</td>
                <td>{{ fmtNum(r.leadCount) }}</td>
                <td>{{ fmtNum(r.booked) }}</td>
                <td>{{ fmtNum(r.attended) }}</td>
                <td>{{ fmtNum(r.closed) }}</td>
                <td>{{ fmtPct(r.bookingRate) }}</td>
                <td>{{ fmtPct(r.showRate) }}</td>
                <td class="is-strong">{{ fmtPct(r.closeRate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Refund / cancellation safety metric -->
      <div class="ad-chart-box">
        <div class="ad-box-head">
          <h3 class="ad-chart-title">Refunds &amp; cancellations within 30 days of close</h3>
          <p class="ad-box-note">
            Split by the financing flag from the quiz. A normal close rate can hide a problem that
            only shows up after the sale: if one group refunds or cancels more, that is the signal.
          </p>
        </div>
        <div v-if="refunds.loading" class="ad-state"><span class="ad-spinner"></span> Loading…</div>
        <div v-else-if="refunds.error" class="ad-state ad-state--error">{{ refunds.error }}</div>
        <div v-else-if="!refunds.data?.rows?.length" class="ad-empty-small">No closed deals in this range</div>
        <template v-else>
          <div v-if="refundAlert" class="ad-notice ad-notice--danger">
            <strong>Higher refund/cancel rate for financing-flag clients:</strong>
            {{ fmtPct(refundAlert.yes) }} ({{ refundAlert.yesN }} closed) vs
            {{ fmtPct(refundAlert.no) }} ({{ refundAlert.noN }} closed). Check the closed counts
            before acting — small groups swing a lot.
          </div>
          <div class="ad-table-wrap">
            <table class="ad-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Closed</th>
                  <th>Refunded / cancelled ≤ 30d</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in refunds.data.rows" :key="String(r.financingFlag)">
                  <td>Financing flag: {{ r.financingFlag ? 'yes' : 'no' }}</td>
                  <td>{{ fmtNum(r.totalClosed) }}</td>
                  <td>{{ fmtNum(r.refundedOrCancelledWithin30d) }}</td>
                  <td class="is-strong">{{ fmtPct(r.rate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
 
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'


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
  if (pct >= 70) return 'var(--emerald-green)'
  if (pct >= 40) return 'var(--warning)'
  return 'var(--danger)'
}

function efficiencyTextColor(pct) {
  if (pct >= 70) return 'var(--success-text)'
  if (pct >= 40) return 'var(--warning-text)'
  return 'var(--danger-text)'
}
 
// ── Utilities ─────────────────────────────────────────
const SELLER_COLORS = [
  'var(--dark-green)', 'var(--emerald-green)', 'var(--warning)', 'var(--danger)',
  'var(--text-secondary)', '#2e9e74', '#b98a1e', 'var(--gray-6)',
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


const GRANULARITIES = [
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
]
const COHORT_OPTIONS = [8, 12, 26, 52]
const LOW_SAMPLE = 20

const isoDay = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const filters = reactive({
  from: isoDay(daysAgo(84)),
  to: isoDay(new Date()),
  granularity: 'week',
})
const cohortWeeks = ref(12)

const makeState = () => reactive({ loading: false, error: null, data: null })
const funnel = makeState()
const costPerCall = makeState()
const sales = makeState()
const cohorts = makeState()
const q4 = makeState()
const q5 = makeState()
const refunds = makeState()
const syncLog = makeState()

const segmentBlocks = computed(() => [
  {
    key: 'q4',
    title: 'Results by Q4 answer',
    note: 'Close rate per answer tells you whether the price is wrong or the offer is wrong for that group.',
    state: q4,
  },
  {
    key: 'q5',
    title: 'Results by Q5 concern',
    note: 'Booking and close rate by the concern people named in the quiz.',
    state: q5,
  },
])

async function load(state, url, query) {
  state.loading = true
  state.error = null
  try {
    state.data = await $fetch(url, { query })
  } catch (err) {
    state.data = null
    state.error =
      err?.data?.statusMessage || err?.data?.message || err?.message || 'Request failed'
  } finally {
    state.loading = false
  }
}

const rangeQuery = () => ({
  from: `${filters.from}T00:00:00.000Z`,
  to: `${filters.to}T23:59:59.999Z`,
  granularity: filters.granularity,
})

async function loadMarketing() {
  if (!filters.from || !filters.to || filters.from > filters.to) return
  const q = rangeQuery()
  await Promise.all([
    load(funnel, '/api/analytics/funnel', q),
    load(costPerCall, '/api/analytics/ads/cost-per-call', q),
    load(sales, '/api/analytics/sales', q),
    load(q4, '/api/analytics/segments/q4', q),
    load(q5, '/api/analytics/segments/q5', q),
    load(refunds, '/api/analytics/safety/refunds', q),
  ])
}

const loadCohorts = () =>
  load(cohorts, '/api/analytics/cohort-roas', { weeks: cohortWeeks.value })

const loadSyncLog = () => load(syncLog, '/api/meta/sync')

const syncing = ref(false)
const syncMessage = ref('')

async function runSync() {
  syncing.value = true
  syncMessage.value = ''
  try {
    const res = await $fetch('/api/meta/sync', {
      method: 'POST',
      query: { from: filters.from, to: filters.to },
    })
    syncMessage.value = `Synced ${res.recordsSynced} rows`
  } catch (err) {
    syncMessage.value =
      err?.data?.statusMessage || err?.data?.message || err?.message || 'Sync failed'
  } finally {
    syncing.value = false
    await Promise.all([loadSyncLog(), loadMarketing(), loadCohorts()])
  }
}

const lastSync = computed(() => syncLog.data?.logs?.[0] || null)

const syncLabel = computed(() => {
  if (syncing.value) return 'Syncing…'
  if (syncMessage.value) return syncMessage.value
  const s = lastSync.value
  if (!s) return syncLog.loading ? 'Checking sync status…' : 'Meta has not been synced yet'
  if (s.status === 'RUNNING') return 'Sync in progress…'
  if (s.status === 'FAILED') return `Last sync failed: ${s.error || 'unknown error'}`
  return `Last sync ${new Date(s.finishedAt || s.startedAt).toLocaleString()} · ${s.recordsSynced} rows`
})

const syncStatusClass = computed(() => {
  if (syncing.value) return ''
  const s = lastSync.value
  if (s?.status === 'FAILED') return 'is-fail'
  if (s?.status === 'SUCCESS') return 'is-ok'
  return ''
})

const refundAlert = computed(() => {
  const rows = refunds.data?.rows || []
  const yes = rows.find((r) => r.financingFlag)
  const no = rows.find((r) => !r.financingFlag)
  if (!yes || !no || yes.rate == null || no.rate == null) return null
  if (yes.rate <= no.rate) return null
  return { yes: yes.rate, no: no.rate, yesN: yes.totalClosed, noN: no.totalClosed }
})

const fmtNum = (v) => (v == null ? '—' : Number(v).toLocaleString('en-US'))
const fmtPct = (v) => (v == null ? '—' : (v * 100).toFixed(1) + '%')
const fmtRoas = (v) => (v == null ? '—' : v.toFixed(2) + '×')
const fmtMoney = (v) => {
  if (v == null) return '—'
  const d = Number.isInteger(v) ? 0 : 2
  return '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}
const fmtPeriod = (iso, granularity) => {
  const d = new Date(iso)
  return granularity === 'month'
    ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

watch(() => [filters.from, filters.to, filters.granularity], loadMarketing)
watch(cohortWeeks, loadCohorts)

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
  loadSyncLog()
  loadMarketing()
  loadCohorts()
})

  definePageMeta({
        layout: 'admin'
    })
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.ad-section {
  --success-text: #0a8f52;
  --warning-text: #9a6a08;
  --danger-text: #9b2c2c;

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
  @include mixins.fz-h3($size: 1.25rem, $color: var(--white));
  margin: 0 0 4px;
}

.ad-section__sub {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--white));
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
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-secondary));
  padding: 16px 0;
  text-align: center;
}

// Avatar keeps a light fill; the seller colour is the ring, so initials stay readable on any colour.
.ad-avatar {
  box-sizing: border-box;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--surface-green);
  color: var(--dark-green);
  border: 2px solid var(--emerald-green);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--sm {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
}

.ad-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.ad-metric {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  padding: 18px;
  text-align: center;

  &__icon {
    font-size: 22px;
    margin-bottom: 8px;
  }

  &__val {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
    color: var(--text-primary);
  }

  &__lbl {
    @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  }

  &--green {
    border-color: rgba(0, 221, 120, 0.45);
    .ad-metric__val {
      color: var(--success-text);
    }
  }

  &--red {
    border-color: rgba(240, 91, 91, 0.45);
    .ad-metric__val {
      color: var(--danger);
    }
  }

  &--yellow {
    border-color: rgba(244, 183, 64, 0.55);
    .ad-metric__val {
      color: var(--warning-text);
    }
  }

  &--dark {
    border-color: rgba(0, 51, 35, 0.3);
    .ad-metric__val {
      color: var(--dark-green);
    }
  }

  &--neutral {
    .ad-metric__val {
      color: var(--text-secondary);
    }
  }
}

.ad-charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ad-chart-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  padding: 22px;

  &--wide {
    grid-column: 1 / -1;
  }
}

.ad-chart-title {
  @include mixins.fz-h5($size: 0.9375rem, $color: var(--text-primary));
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
  fill: var(--text-primary);
  font-family: var(--font-aeonik, sans-serif);
}

.ad-donut__sub {
  font-size: 10px;
  fill: var(--text-muted);
  font-family: var(--font-aeonik, sans-serif);
}

.ad-donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ad-legend-item {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-secondary));
  display: flex;
  align-items: center;
  gap: 8px;
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
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
}

.ad-funnel__track {
  background: var(--chart-track);
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
}

.ad-funnel__fill {
  height: 100%;
  background: var(--danger);
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-funnel__count {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
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
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-primary));
  display: flex;
  align-items: center;
  gap: 8px;
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
  background: var(--chart-track);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;

  &--thin {
    height: 5px;
  }
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
  color: var(--text-secondary);
}

.ad-bar-chart__completed {
  color: var(--success-text);
}

.ad-bar-chart__legend {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  display: flex;
  gap: 20px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
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
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-primary));
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.ad-efficiency__bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ad-efficiency__track {
  flex: 1;
  background: var(--chart-track);
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
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
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
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-utm__track {
  background: var(--chart-track);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.ad-utm__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--dark-green), var(--emerald-green));
  border-radius: 4px;
  transition: width 0.6s;
}

.ad-utm__count,
.ad-utm__pct {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  text-align: right;
}

/* ── Ads, funnel & sales ─────────────────────────── */
.ad-mkt {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  > * {
    min-width: 0;
  }
}

.ad-mkt__title {
  @include mixins.fz-h3($size: 1.125rem, $color: var(--text-primary));
  margin: 0 0 4px;
}

.ad-mkt__sub {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-secondary));
  margin: 0;
}

.ad-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-card);
  padding: 14px 18px;
}

.ad-field {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  display: flex;
  flex-direction: column;
  gap: 4px;

  input,
  select {
    @include mixins.caption-font($size: 0.8125rem, $color: var(--text-primary));
    background: var(--white);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    padding: 8px 10px;

    &:focus {
      outline: none;
      border-color: var(--emerald-green);
    }
  }
}

.ad-seg {
  display: inline-flex;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
}

.ad-seg__btn {
  @include mixins.button-font($size: 0.8125rem);
  background: transparent;
  border: 0;
  padding: 10px 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all ease 0.3s;

  &:hover {
    color: var(--dark-green);
  }

  &.is-active {
    background: var(--dark-green);
    color: var(--soft-white);
  }
}

.ad-sync {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ad-sync__status {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));

  &.is-ok {
    color: var(--success-text);
  }

  &.is-fail {
    color: var(--danger-text);
  }
}

.ad-btn {
  @include mixins.button-primary($size: 14px);
  padding: 10px 16px;

  &:disabled {
    cursor: not-allowed;
  }
}

.ad-box-head {
  margin-bottom: 14px;

  .ad-chart-title {
    margin-bottom: 4px;
  }

  &--row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
}

.ad-box-note {
  @include mixins.caption-font($size: 0.75rem, $color: var(--text-secondary));
  margin: 0;
  max-width: 760px;
}

.ad-state {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-secondary));
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 0;

  &--error {
    color: var(--danger-text);
  }
}

.ad-notice {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--warning-text));
  border: 1px dashed var(--warning);
  background: rgba(244, 183, 64, 0.14);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;

  &--danger {
    color: var(--danger-text);
    border-color: var(--danger);
    background: var(--surface-danger);
  }
}

.ad-table-wrap {
  overflow-x: auto;
}

.ad-table {
  @include mixins.caption-font($size: 0.8125rem, $color: var(--text-primary));
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 9px 10px;
    text-align: right;
    white-space: nowrap;
    border-bottom: 1px solid var(--border-light);
  }

  th:first-child,
  td:first-child {
    text-align: left;
    position: sticky;
    left: 0;
    background: var(--white);
  }

  thead th {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--text-secondary);
  }

  thead .ad-table__group th {
    text-align: center;
    color: var(--dark-green);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  .is-strong {
    font-weight: 700;
  }

  tr.is-low td {
    color: var(--text-muted);
  }

  .ad-table__answer {
    white-space: normal;
    min-width: 220px;
  }
}

.ad-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;

  &--warn {
    background: rgba(244, 183, 64, 0.2);
    color: var(--warning-text);
  }

  &--ok {
    background: var(--surface-green);
    color: var(--dark-green);
  }

  &--open {
    background: var(--light-grey);
    color: var(--text-secondary);
  }
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

  .ad-sync {
    margin-left: 0;
  }
}
</style>