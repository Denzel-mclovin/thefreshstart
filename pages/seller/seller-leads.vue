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
