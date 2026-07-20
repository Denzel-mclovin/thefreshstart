<!-- <template>
  Seller Leads

  <div class="seller_leads_main">
    <section v-if="activeTab === 'my'" class="sd-section">
      <div class="sd-section__head">
        <h2 class="sd-section__title">Мои лиды</h2>
        <p class="sd-section__sub">Пользователи, закреплённые за вами</p>
      </div>

      <div v-if="loadingMy" class="sd-loading">
        <span class="sd-spinner"></span> Загрузка...
      </div>

      <div v-else-if="myLeads.length === 0" class="sd-empty">
        <span>📋</span>
        <p>У вас пока нет закреплённых лидов</p>
      </div>

      <div v-else class="sd-cards">
        <div
          v-for="lead in myLeads"
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
                {{ lead.firstName || "Без имени" }} {{ lead.lastName || "" }}
              </div>
              <div class="sd-card__meta">
                {{ lead.phone || lead.email || "—" }}
              </div>
            </div>
            <span
              class="sd-badge"
              :class="`sd-badge--${lead.status.toLowerCase()}`"
            >
              {{ statusLabel(lead.status) }}
            </span>
          </div>

          <div class="sd-card__progress">
            <div class="sd-progress">
              <div
                class="sd-progress__bar"
                :style="{
                  width: ((lead.answers?.length || 0) / 5) * 100 + '%',
                }"
              ></div>
              <span>{{ lead.answers?.length || 0 }}/5 ответов</span>
            </div>
          </div>

          <div class="sd-card__footer">
            <span class="sd-tag sd-tag--source">{{
              lead.utmSource || "direct"
            }}</span>
            <span class="sd-card__date">{{ formatDate(lead.createdAt) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template> -->

<template>
  <section class="seller-section">

    <div class="section__head">
      <h1>My Leads</h1>
      <p>Assigned users</p>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      Loading...
    </div>

    <div
      v-else
      class="cards"
    >

      <div
        v-for="lead in leads"
        :key="lead.id"
        class="card"
        @click="openLead(lead)"
      >

        <div class="card__top">

          <div class="avatar">
            {{ lead.firstName?.[0] }}
          </div>

          <div>

            <h3>
              {{ lead.firstName }}
              {{ lead.lastName }}
            </h3>

            <p>
              {{ lead.phone || lead.email }}
            </p>

          </div>

        </div>

      </div>

    </div>

    <SellerLeadPopup
      v-if="selectedLead"
      :lead="selectedLead"
      @close="selectedLead = null"
    />

  </section>
</template>

<script setup >

// const props = defineProps({
//   sellerId: string
// })

const leads = ref([])
const selectedLead = ref(null)
const loading = ref(false)

async function fetchLeads() {

  loading.value = true

  try {

    // leads.value = await $fetch(
    //   `/api/leads?sellerId=${props.sellerId}`
    // )

  } finally {
    loading.value = false
  }
}

function openLead(lead) {
  selectedLead.value = lead
}

onMounted(() => {

    console.log("fetch leads");
    
    // fetchLeads();
})

definePageMeta({
  layout: "seller",
});

</script>

<style scoped lang="scss">

.section {
  padding: 24px;
  color: white;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
  gap: 16px;
}

.card {
  padding: 18px;
  border-radius: 16px;
  background: #161b26;
  border: 1px solid #2a3144;
  cursor: pointer;
  transition: .2s;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #00e5c7;
}

.card__top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #00e5c7;
  color: black;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card p {
  color: #8892a4;
}

</style>
