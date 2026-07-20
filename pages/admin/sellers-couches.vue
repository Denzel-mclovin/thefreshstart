<template>
  <div class="items-seller_section">
    <div class="admin-container">
      <div class="top-block">
        <h1 class="page-title">Sellers / coaches page</h1>
        <div class="burger-wrap">
          <SharedDashBurger />
        </div>
      </div>

      <div class="content-wrap">
        <div class="main-card">
          <div class="card-header">
            <h6>Sellers / coaches list</h6>
          </div>

          <div class="loader-wrap" v-if="loader">
            <SharedLoader />
          </div>

          <template v-else>
            <div class="seller_section">
              <div class="seller_section-label">
                <i class="ti ti-users"></i>
                Active sellers
                <span class="count-badge">{{ sellers.length }}</span>
              </div>

              <div v-if="sellers.length === 0" class="empty-state">
                <i class="ti ti-users"></i>
                <div class="empty-title">No sellers yet</div>
                <div class="empty-sub">Active sellers will appear here</div>
              </div>

              <div v-else class="sellers-grid">
                <div
                  v-for="(seller, idx) in sellers"
                  :key="idx"
                  class="seller-card"
                >
                  <div class="card-top">
                    <div class="avatar">
                      {{ initials(seller.name, seller.lastName) }}
                    </div>
                    <div>
                      <div class="card-name">
                        {{ seller.name }} {{ seller.lastName }}
                      </div>
                      <div class="card-mail">{{ seller.email }}</div>
                      <div class="card-meta">Seller</div>
                    </div>
                  </div>
                  <div class="card-stats">
                    <div class="stat-pill">
                      <div class="stat-label">Active users</div>
                      <div class="stat-value">{{ seller.users.length }}</div>
                    </div>
                    <div class="stat-pill">
                      <div class="stat-label">Pending links</div>
                      <div class="stat-value">{{ seller.pendingCount }}</div>
                    </div>
                  </div>
                  <button
                    class="btn-primary"
                    @click="
                      modalStore.showModal('ShowSellerDetails', { seller })
                    "
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>

            <div class="seller_section">
              <hr class="seller_section-divider" />

              <div class="seller_section-label">
                <i class="ti ti-clock"></i>
                Pending approvals
                <span class="count-badge grey">{{
                  pendingSellers.length
                }}</span>
              </div>

              <div class="tabs-row">
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'new' }"
                  @click="activeTab = 'new'"
                >
                  New sellers
                </button>
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'archive' }"
                  @click="activeTab = 'archive'"
                >
                  Archive
                </button>
              </div>

              <template v-if="activeTab === 'new'">
                <div v-if="pendingSellers.length === 0" class="empty-state">
                  <i class="ti ti-circle-check"></i>
                  <div class="empty-title">No pending requests</div>
                  <div class="empty-sub">All sellers are reviewed</div>
                </div>
                <div v-else class="pending-list">
                  <div
                    v-for="(seller, idx) in pendingSellers"
                    :key="idx"
                    class="pending-card"
                  >
                    <div class="avatar grey">
                      {{ initials(seller.name, seller.lastName) }}
                    </div>
                    <div class="p-info">
                      <div class="card-name">
                        {{ seller.name }} {{ seller.lastName }}
                      </div>
                      <div class="card-meta">{{ seller.email }}</div>
                    </div>
                    <div class="card-actions">
                      <button class="btn-approve" @click="approve(seller)">
                        Approve
                      </button>
                      <button class="btn-ghost" @click="reject(seller)">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div v-if="archivedSellers.length === 0" class="empty-state">
                  <i class="ti ti-archive"></i>
                  <div class="empty-title">Archive is empty</div>
                  <div class="empty-sub">Rejected sellers will appear here</div>
                </div>
                <div v-else class="pending-list">
                  <div
                    v-for="(seller, idx) in archivedSellers"
                    :key="idx"
                    class="pending-card"
                  >
                    <div class="avatar grey">
                      {{ initials(seller.name, seller.lastName) }}
                    </div>
                    <div class="p-info">
                      <div class="card-name">
                        {{ seller.name }} {{ seller.lastName }}
                        <span class="tag-rejected">rejected</span>
                      </div>
                      <div class="card-meta">{{ seller.email }}</div>
                    </div>
                    <div class="card-actions">
                      <button class="btn-ghost" @click="restore(seller)">
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const modalStore = useModalStore();
const adminStore = useAdminStore();
const loader = ref(true);
const sellers = ref([]);
const pendingSellers = ref([]);
const archivedSellers = ref([]);
const activeTab = ref("new");

function initials(name, lastName) {
  return ((name?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase();
}

function approve(seller) {

  adminStore.setApprovedSellers(seller.id);
}

function reject(seller) {
  pendingSellers.value = pendingSellers.value.filter((s) => s.id !== seller.id);
  archivedSellers.value.push(seller);

  adminStore.setRejectedSellers(seller.id);
}

function restore(seller) {
  archivedSellers.value = archivedSellers.value.filter(
    (s) => s.id !== seller.id,
  );
  pendingSellers.value.push(seller);
}

onMounted(async () => {
  try {
    await adminStore.getActiveSellers();

    sellers.value = adminStore.activeSellers;
    pendingSellers.value = adminStore.pendingSellers;
    archivedSellers.value = adminStore.archivedSellers;
  } catch (err) {
    console.error("Failed to load sellers:", err);
  }
  loader.value = false;
});

definePageMeta({ layout: "admin" });
</script>

<style lang="scss" scoped>
$accent: var(--dark-green);
$white: #fff;
$grey: #999;

.items-seller_section {
  min-height: 100vh;
}

.admin-container {
  margin-inline: 0.5rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.top-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 2rem;
  margin-bottom: 2.5rem;
}

.page-title {
  margin: 0;
  font-weight: 700;
  color: $white;
}

.burger-wrap {
  display: flex;
  align-items: center;
  @media (min-width: 1280px) {
    display: none;
  }
}

.content-wrap {
  @media (max-width: 768px) {
    padding-inline: 0.25rem;
  }
}

.main-card {
  background: $white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  padding-bottom: 2rem;

  .dark & {
    background: var(--dark-grey);
    border: 1px solid var(--dark-border-color);
    box-shadow: none;
  }
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  h6 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    .dark & {
      color: $white;
    }
  }
}

.loader-wrap {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seller_section {
  padding: 1.5rem 1.5rem 0;
  @media (max-width: 768px) {
    padding: 1rem 0.75rem 0;
  }
}

.seller_section-divider {
  border: none;
  border-top: 0.5px solid #eee;
  margin-bottom: 1.5rem;
  .dark & {
    border-color: var(--dark-border-color);
  }
}

.seller_section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-primary);
  margin-bottom: 12px;
  i {
    font-size: 15px;
  }
}

.count-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 20px;
  background: $accent;
  color: $white;
  text-transform: none;
  letter-spacing: 0;

  &.grey {
    background: #f0f0f0;
    color: var(--dark-color);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 2.5rem 1rem;
  border: 0.5px dashed #ddd;
  border-radius: 12px;
  text-align: center;
  .dark & {
    border-color: rgba(255, 255, 255, 0.1);
  }

  i {
    font-size: 30px;
    color: #ccc;
    .dark & {
      color: #555;
    }
  }
}

.empty-title {
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

.empty-sub {
  font-size: 12px;
  color: #bbb;
  .dark & {
    color: #666;
  }
}

.sellers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
}

.seller-card {
  background: #f7f5fa;
  border: 0.5px solid #ede9f4;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--primary-btn-hover);
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $accent;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  text-transform: capitalize;
  .dark & {
    color: $white;
  }
}

.card-meta,
.card-mail {
  font-size: 12px;
  color: var(--text-primary);
  margin-top: 2px;
}

.card-mail {
  font-weight: 500;
}

.card-stats {
  display: flex;
  gap: 8px;
}

.stat-pill {
  flex: 1;
  background: $white;
  border: 0.5px solid #eee;
  border-radius: 10px;
  padding: 7px 10px;
  .dark & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }
}

.stat-label {
  font-size: 11px;
  color: $grey;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  .dark & {
    color: $white;
  }
}

.btn-primary {
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  background: $accent;
  color: $white;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
}

.tabs-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.tab-btn {
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 0.5px solid #ddd;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;

  .dark & {
    border-color: rgba(255, 255, 255, 0.15);
    color: #aaa;
  }

  &.active {
    background: $accent;
    color: $white;
    border-color: $accent;
  }

  &:not(.active):hover {
    background: #f5f5f5;
    .dark & {
      background: rgba(255, 255, 255, 0.06);
    }
  }
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pending-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: $white;
  border: 0.5px solid #eee;
  border-radius: 12px;
  padding: 12px 14px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #ccc;
  }
}

.p-info {
  flex: 1;
  min-width: 0;
}

.card-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-approve {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: $accent;
  color: $white;
  &:hover {
    opacity: 0.85;
  }
}

.btn-ghost {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: #f0f0f0;
  color: var(--text-primary);
  border: 0.5px solid #ddd;
  &:hover {
    opacity: 0.75;
  }
  .dark & {
    background: rgba(255, 255, 255, 0.08);
    color: #ccc;
    border-color: rgba(255, 255, 255, 0.12);
  }
}

.tag-rejected {
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  padding: 1px 7px;
  border-radius: 20px;
  background: #c8fee6;
  color: $accent;
  margin-left: 6px;
  vertical-align: middle;
}
</style>
