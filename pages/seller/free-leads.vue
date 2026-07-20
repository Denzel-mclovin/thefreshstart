<template>
  <section class="sd-section">
    <div class="sd-section__head">
      <h2 class="sd-section__title">Free leads</h2>
      <p class="sd-section__sub">Users who have completed the quiz and are not assigned to a seller</p>
    </div>

    <div v-if="loading" class="sd-loading">
      <span class="sd-spinner"></span> Loading...
    </div>

    <div v-else-if="leads.length === 0" class="sd-empty">
      <span>🎉</span>
      <p>No free leads available</p>
    </div>

    <div v-else class="sd-table-wrap">
      <table class="sd-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Source</th>
            <th>Content</th>
            <th>Date</th>
            <th>Progress</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in leads" :key="lead.id" class="sd-table__row">
            <td class="sd-table__name">
              {{ lead.firstName || '—' }} {{ lead.lastName || '' }}
            </td>
            <td>{{ lead.phone || '—' }}</td>
            <td>{{ lead.email || '—' }}</td>
            <td>
              <span class="sd-tag">{{ lead.utmSource || 'direct' }}</span>
            </td>
            <td><span class="ad-seller-chip__dot">{{ lead.utmContent || '-' }}</span></td>

            <td class="sd-table__date">{{ formatDate(lead.createdAt) }}</td>
            <td>
              <div class="sd-progress-wrap">
                <div class="sd-progress">
                  <div
                    class="sd-progress__bar"
                    :style="{ width: ((lead.answers?.length || 0) / 5 * 100) + '%' }"
                  ></div>
                </div>
                <span class="sd-progress__label">{{ lead.answers?.length || 0 }}/5</span>
              </div>
            </td>
            <td>
              <button
                class="sd-btn"
                :disabled="takingId === lead.id"
                @click="takeLeadHandler(lead.id)"
              >
                {{ takingId === lead.id ? '...' : 'Take' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>

defineEmits(['take'])

import { ref, onMounted } from 'vue'


// STORES

import { useSellerStore } from '../../stores/seller';

// const leads = ref([])
// const loading = ref(false)
// const takingId = ref(null)

// const loadLeads = async () => {
//   try {
//     loading.value = true

//     const response = await $fetch('/api/seller/free-leads')

//     leads.value = response.leads || response
//   } catch (error) {
//     console.error('Failed to load leads', error)
//   } finally {
//     loading.value = false
//   }
// }

// onMounted(async () => {
//   await loadLeads()
// })



// DEFINE STORES

const sellerStore = useSellerStore();

function formatDate(d) {
  if (!d) return '—'

  return new Date(d).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}


const takingId = ref(null);



const leads = computed(() => sellerStore.freeLeads);
const loading = computed(() => sellerStore.loading);

// console.log('Loaded leads:', leads.value);


const takeLeadHandler = async (leadId) => {
  console.log('lead', leadId);

  await sellerStore.takeFreeLead(leadId);
}



onMounted(async () => {
  await sellerStore.getFreeLeads();
})


definePageMeta({
  layout: 'seller',
})
</script>

<style scoped>
.sd-section__head {
  margin-bottom: 50px; 
  padding-top: 40px;
  
}

.sd-section__title {
  font-family: var(--font-aeonik);
  font-size: var(--text-3xl);
  color: var(--soft-white);
  margin: 0 0 10px;
}

.sd-section__sub {
  font-size: 1rem;
  color: var(--soft-white);
  margin: 0;
}

.sd-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #FFF;
  font-size: 14px;
  padding: 40px 0;
}

.sd-spinner {
  width: 18px;
  height: 18px;
  border:2px solid var(--border-light);
  border-top-color:var(--emerald-green);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.sd-empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
.sd-empty span { font-size: 36px; display: block; margin-bottom: 10px; }
.sd-empty p { font-size: 14px; margin: 0; }

/* Table */
.sd-table-wrap {
  border:1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:var(--shadow-card);
}

.sd-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #fff;
  font-family:var(--font-aeonik);
}

.sd-table thead {
  background:var(--soft-green);
}

.sd-table th {
  padding: 13px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--dark-green);
  border-bottom: 1px solid var(--border-light);
}

.sd-table__row {
  border-bottom:1px solid var(--border-light);  
  transition: background .15s;
}

.sd-table__row:last-child { 
  border-bottom: none; 
}
.sd-table__row:hover { 
    background:rgba(0,221,120,.05); 
    cursor: pointer;
  
}

.sd-table td {
  padding: 13px 16px;
  vertical-align: middle;
  color: black;
}

.sd-table__name { 
  font-weight: 600; 
  color:var(--dark-green); 
}
.sd-table__date { 
  color: #999; 
  font-size: 13px; 
}

/* Progress */
.sd-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sd-progress {
  width: 72px;
  height: 7px;
  background:var(--chart-track);
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.sd-progress__bar {
  height: 100%;
  background:linear-gradient(
        90deg,
        var(--emerald-green),
        #25F096
  );
  border-radius: 3px;
  transition: width .3s;
}

.sd-progress__label {
  font-size: 13px;
  color: var(--dark-green);
  font-weight: 500;
  white-space: nowrap;
}

.sd-tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background:var(--dark-green);
  color:var(--soft-white);
  border: 1px solid var(--border-light);
}

.sd-btn {
  padding: 7px 18px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--dark-green);
  color:var(--dark-green);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 1px 4px var(--shadow-card);
}

.sd-btn:hover:not(:disabled) {
  background:var(--secondary-btn-hover);
  color: #fff;
  box-shadow: 0 4px 14px var(--shadow-small);
  border: 1px solid transparent;
}

.sd-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}
</style>
