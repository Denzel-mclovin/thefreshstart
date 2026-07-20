<template>
  <section class="sd-section">
    <div class="sd-section__head">
      <h2 class="sd-section__title">Quiz analytics</h2>
      <p class="sd-section__sub">Overall completion statistics</p>
    </div>

    <div v-if="loading" class="sd-loading">
      <span class="sd-spinner"></span> Loading...
    </div>

    <div v-else class="sd-analytics">


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
        <div class="sd-metric sd-metric--red">
          <div class="sd-metric__icon">🚪</div>
          <div class="sd-metric__value">{{ analytics?.abandoned || 0 }}</div>
          <div class="sd-metric__label">Abandoned quiz</div>
        </div>
        <div class="sd-metric sd-metric--yellow">
          <div class="sd-metric__icon">⏳</div>
          <div class="sd-metric__value">{{ analytics?.unassigned || 0 }}</div>
          <div class="sd-metric__label">Unassigned</div>
        </div>
      </div>

      <div class="sd-chart-block">
        <h3 class="sd-chart-title">Drop-off by quiz steps</h3>
        <div class="sd-funnel">
          <div v-for="step in 5" :key="step" class="sd-funnel__row">
            <div class="sd-funnel__label">Step {{ step }}</div>
            <div class="sd-funnel__track">
              <div class="sd-funnel__fill" :style="{ width: funnelWidth(step) }"></div>
            </div>
            <div class="sd-funnel__count">{{ analytics?.dropoffByStep?.[step] || 0 }} people</div>
          </div>
        </div>
      </div>

      <div class="sd-chart-block">
        <h3 class="sd-chart-title">Completion rate</h3>
        <div class="sd-donut-wrap">
          <svg class="sd-donut" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#EAF6EF" stroke-width="14" />
            <circle
              cx="60" cy="60" r="48"
              fill="none"
              stroke="#00DD78"
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
              completed
            </text>
          </svg>
          <div class="sd-donut__legend">
            <div class="sd-donut__item">
              <span class="sd-donut__dot" style="background: #480074"></span>
              Completed ({{ analytics?.completed || 0 }})
            </div>
            <div class="sd-donut__item">
              <span class="sd-donut__dot" style="background: #fce7f3"></span>
              Abandoned ({{ analytics?.abandoned || 0 }})
            </div>
            <div class="sd-donut__item">
              <span class="sd-donut__dot" style="background: #f59e0b"></span>
              In Progress ({{ analytics?.inProgress || 0 }})
            </div>
          </div>
        </div>
      </div>

      <!-- UTM source -->
      <div class="sd-chart-block">
        <h3 class="sd-chart-title">UTM Sources</h3>
        <div class="sd-bar-chart">
          <div
            v-for="(count, source) in analytics?.utmSources"
            :key="source"
            class="sd-bar-chart__row"
          >
            <div class="sd-bar-chart__label">{{ source }}</div>
            <div class="sd-bar-chart__track">
              <div class="sd-bar-chart__fill" :style="{ width: utmWidth(count) }"></div>
            </div>
            <div class="sd-bar-chart__count">{{ count }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useSellerStore } from '~~/stores/seller'


const sellerStore = useSellerStore();

// REFS

const analytics = ref(null)
const loading = ref(true)


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

function funnelWidth(step) {

  const max = Math.max(...Object.values(analytics.value?.dropoffByStep || {}), 1)
  const val = analytics.value?.dropoffByStep?.[step] || 0

  return Math.round((val / max) * 100) + '%'
}

function utmWidth(count) {
  const max = Math.max(...Object.values(analytics.value?.utmSources || {}), 1)
  return Math.round((count / max) * 100) + '%'
}



const loadAnalytics = async () => {
  try {

    const getAnalyticReq = await sellerStore.getSellerAnalytic();
    // const res = await $fetch('/api/admin/analytics')

    console.log('getAnalyticReq', getAnalyticReq)

    if (getAnalyticReq.success) {
      analytics.value = getAnalyticReq.analytics
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
  layout: 'seller',
})
</script>

<style scoped>


.sd-section__head {
  margin-bottom: 32px;
  padding-top: 20px;
}

.sd-section__title {
  font-family: var(--font-aeonik);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--soft-white);
  margin-bottom: 6px;
}

.sd-analytics {
  padding-bottom: 80px;
}

.sd-section__sub {
  font-size: var(--text-md);
  color: var(--text-secondary);
}

/* Loading */
.sd-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
  color:var(--soft-white);
}

.sd-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
  border:2px solid var(--border-light);
  border-top-color:var(--emerald-green);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Metrics */
.sd-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
  margin-bottom:32px;
}

.sd-metric{
    background:var(--white);
    border:1px solid var(--border-light);
    border-radius:var(--radius-medium);

    padding:26px;

    box-shadow:var(--shadow-card);

    transition:.25s;
}

.sd-metric:hover{
    transform:translateY(-3px);
    border-color:var(--emerald-green);
}



.sd-metric__icon{

    width:54px;
    height:54px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    font-size:24px;

    background:var(--surface-green);

    margin-bottom:18px;
}

.sd-metric--green .sd-metric__icon{
    background:#DDFCEA;
}

.sd-metric--red .sd-metric__icon{
    background:#FFE8E8;
}

.sd-metric--yellow .sd-metric__icon{
    background:#FFF5DA;
}

.sd-metric__value{

    font-size:44px;

    line-height:1;

    font-weight:700;

    color:var(--dark-green);

    margin-bottom:10px;
}
.sd-metric--green .sd-metric__value{
    color:var(--success);
}

.sd-metric--red .sd-metric__value{
    color:var(--danger);
}

.sd-metric--yellow .sd-metric__value{
    color:var(--warning);
}

.sd-metric__label{

    font-size:var(--text-sm);

    color:var(--text-secondary);

    font-weight:500;
}

/* Chart blocks */
.sd-chart-block{

    background:var(--white);

    border-radius:var(--radius-medium);

    border:1px solid var(--border-light);

    padding:30px 30px 60px 30px;

    box-shadow:var(--shadow-card);

    margin-bottom: 24px;
}
.sd-chart-title{

    font-size:var(--text-xl);

    font-weight:700;

    color:var(--dark-green);

    margin-bottom:26px;
}

/* Funnel */
.sd-funnel { display: flex; flex-direction: column; gap: 14px; }

.sd-funnel__row {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 14px;
}


.sd-funnel__track{

    height:12px;

    background:var(--chart-track);

    border-radius:100px;
}

.sd-funnel__fill{

  height: 100%;
  border-radius: 4px;
  transition: width .6s cubic-bezier(.4, 0, .2, 1);
  border-radius:100px;
  background:linear-gradient(
      90deg,
      var(--emerald-green),
      #00C96B
  );
}

.sd-funnel__label,
.sd-funnel__count{
    font-size: 13px; color: #999; text-align: right;
    color:var(--text-secondary);
}

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

.sd-donut__pct{

    fill:var(--dark-green);

    font-size:26px;

    font-weight:700;
}


.sd-donut__sub{

    fill:var(--text-secondary);
}

.sd-donut__legend { display: flex; flex-direction: column; gap: 12px; }

.sd-donut__item{

    color:var(--dark-green);

    font-size:15px;
}

.sd-donut__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Bar chart */
.sd-bar-chart { display: flex; flex-direction: column; gap: 14px; }

.sd-bar-chart__row {
  display: grid;
  grid-template-columns: 100px 1fr 40px;
  align-items: center;
  gap: 14px;
}

.sd-bar-chart__label {
  font-size: 13px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sd-bar-chart__track{
  border-radius: 4px;
  overflow: hidden;

  background:var(--chart-track);


  height:10px;
}

.sd-bar-chart__fill{

  height: 100%;
  border-radius: 4px;
  transition: width .6s;

    background:linear-gradient(
        90deg,
        var(--emerald-green),
        #00C96B
    );
}

.sd-bar-chart__count { font-size: 13px; color: #999; text-align: right; }
</style>
