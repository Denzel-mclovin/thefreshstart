<template>
  <section class="sd-section">
    <div class="sd-section__head">
      <h2 class="sd-section__title">My leads</h2>
      <p class="sd-section__sub">Users attached to you</p>
    </div>

    <div v-if="loading" class="sd-loading">
      <span class="sd-spinner"></span> Loading...
    </div>

    <div v-else-if="leads.length === 0" class="sd-empty">
      <span>📋</span>
      <p>You don't have any assigned leads yet</p>
    </div>

    <div v-else class="sd-cards">
      <div
        v-for="lead in leads"
        :key="lead.id"
        class="sd-card"
        @click="openLead(lead)"
      >
        <div class="sd-card__top">
          <div class="sd-card__avatar">
            {{ getInitials(lead.firstName, lead.lastName) }}
          </div>
          <div class="sd-card__info">
            <div class="sd-card__name">
              {{ lead.firstName || 'Без имени' }} {{ lead.lastName || '' }}
            </div>
            <div class="sd-card__meta">{{ lead.phone || lead.email || '—' }}</div>
          </div>
          <span class="sd-badge" :class="`sd-badge--${lead.status.toLowerCase()}`">
            {{ statusLabel(lead.status) }}
          </span>
        </div>

        <div class="sd-card__progress">
          <div class="sd-progress">
            <div
              class="sd-progress__bar"
              :style="{ width: ((lead.answers?.length || 0) / 5 * 100) + '%' }"
            ></div>
          </div>
          <span class="sd-progress__label">{{ lead.answers?.length || 0 }}/5 answers</span>
        </div>

        <div class="sd-card__footer">
          <span class="sd-tag">{{ lead.utmSource || 'direct' }}</span>
          <span class="sd-card__date">{{ formatDate(lead.createdAt) }}</span>
          <button @click.stop="removeLead(lead.id)" class="sd-card__remove">
            REMOVE
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body"> 

      <div v-if="removeLeadData" class="sd-overlay" @click.self="closeRemove"> 
        <div class="sd-remove">
          <div class="sd-remove_head">
            Are you sure you want to remove this lead?
          </div>
          <div class="sd-remove_body">

            <button class="accept" @click="removeLeadHandler()">
              Remove
            </button>
            <button class="cancel" @click="closeRemove">
              No
            </button>
          </div>
        </div>

      </div>

    </Teleport>

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
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

//STORES
import { useSellerStore } from '../../stores/seller';
import { useModalStore } from '../../stores/modal';

const sellerStore = useSellerStore();

// defineProps({
//   leads: { type: Array, default: () => [] },
//   loading: { type: Boolean, default: false },
// })

const loading = computed(() => sellerStore.loading);
const leads = computed(() => sellerStore.myLeads);

const selectedLead = ref(null)
const removeLeadData = ref(null)
const loaderState = ref(false);

function openLead(lead) { selectedLead.value = lead }
function removeLead(lead) { removeLeadData.value = lead }
function closeLead() { selectedLead.value = null }

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?'
}

function statusLabel(s) {
  return { COMPLETED: 'Completed', ABANDONED: 'Abandoned', IN_PROGRESS: 'In Progress' }[s] || s
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function closeRemove() {
  removeLeadData.value = null;


}


const removeLeadHandler = async () => {

  const removeLeadReq = await sellerStore.removeMyLead(removeLeadData.value);

  console.log('removeLeadReq', removeLeadReq)

    if (removeLeadReq.statusCode !== 200) {
      closeRemove();
      alert('Something went wrong during removing lead');
    }

    closeRemove();
    alert('Lead removed successfully');
}

onMounted(async () => {

 await sellerStore.fetchMyLeads();


})

definePageMeta({
  layout: 'seller',
})
</script>

<style scoped lang="scss">
.sd-section__head { 
  margin-bottom: 24px; 
  padding-top: 20px;

}

.sd-section__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.sd-section__sub {
  font-size: 1rem;
  color: #999;
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

/* Cards */
.sd-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.sd-card {
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: all .22s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 10px;
  background:var(--soft-white);
  border:1px solid var(--gray-2);
  border-radius:var(--radius-medium);
  box-shadow:0 8px 24px rgba(0,51,35,.05);

}

.sd-card:hover {
  transform: translateY(-2px);
  border-color:var(--emerald-green);
  box-shadow:0 16px 40px rgba(0,51,35,.12);
  cursor: pointer;
}

.sd-card__top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.sd-card__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(72,0,116,0.25);
  background:linear-gradient(
      135deg,
      var(--emerald-green),
      var(--dark-green)
  );
  color:white;
  font-weight:700;
  font-size:16px;
}

.sd-card__info { flex: 1; min-width: 0; }

.sd-card__name {
  color:var(--dark-green);
  font-size:var(--text-lg);
  font-weight:700;
}

.sd-card__meta {
  color:var(--text-primary);
  font-size:var(--text-sm);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sd-card__remove {
  font-weight: 600;
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: grab;
  transition: all .2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background:#F05B5B;
  color:white;
  border:none;
  font-weight:600;
}

/* Progress in card */
.sd-card__progress {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sd-progress {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  overflow: hidden;
  height: 8px;
  background:var(--light-grey);
}

.sd-progress__bar {
  height: 100%;
  border-radius: 3px;
  transition: width .35s;
  background:linear-gradient(
      300deg,
      var(--dark-green),
      #17f08d
  );
}

.sd-progress__label {
  font-size: 12px;
  color: var(--dark-green);
  white-space: nowrap;
}

.sd-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sd-card__date {
  font-size: 12px;
  color: #999;
}

/* Tag */
.sd-tag {
  display: inline-block;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background:var(--soft-green);
  color:var(--dark-green);
  border:none;
  padding:6px 12px;
}

/* Badges */
.sd-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.sd-badge--completed { background: #e8f9f0; color: #16a34a; border: 1px solid #bbf0d4; }
.sd-badge--abandoned { background: #fff0f3; color: #dc2626; border: 1px solid #fecdd3; }
.sd-badge--in_progress { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }

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
</style>
