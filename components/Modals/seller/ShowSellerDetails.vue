<template>
  <div class="modal">
    <div class="modal_wrapper">
      <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
        Seller Details
      </SharedModalHead>

      <div class="modal_content">
        <div class="grid_container">
          <div class="seller_info">
            <div class="top_content">
              <img
                :src="props.seller.avatar || '/icons/default-user.webp'"
                alt="avatar"
              />
              <div class="seller_data">
                <div class="seller_name">
                  <span>{{ props.seller.name }}</span>
                  <span>{{ props.seller.lastName }}</span>
                </div>

                <div class="info_row">
                  <span>Email:</span>
                  <span>{{ props.seller.email }}</span>
                </div>

                <div class="info_row">
                  <span>Pending links:</span>
                  <span>{{ props.seller.pendingCount }}</span>
                </div>

                <div class="info_row">
                  <span>Created at:</span>
                  <span>{{
                    toLocalISODateString(props.seller.createdAt)
                  }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="selectedUser && activeUserSection === 'payments'"
              class="user_section"
            >
              <h3>Payments of {{ selectedUser.name }}</h3>
              <div
                class="section_card"
                v-for="payment in selectedUser.payments"
                :key="payment.id"
              >
                <span
                  ><strong>Amount:</strong> {{ payment.amount / 100 }}
                  {{ payment.currency }}</span
                >
                <span><strong>Status:</strong> {{ payment.status }}</span>
                <span
                  ><strong>Date:</strong>
                  {{ toLocalISODateString(payment.paidAt) }}</span
                >
                <span><strong>StripeId:</strong> {{ payment.stripeId }}</span>
              </div>
            </div>

            <div
              v-if="selectedUser && activeUserSection === 'subscriptions'"
              class="user_section"
            >
              <h3>Subscriptions of {{ selectedUser.name }}</h3>
              <div
                class="section_card"
                v-for="sub in selectedUser.subscriptions"
                :key="sub.id"
              >
                <span><strong>Status:</strong> {{ sub.status }}</span>
                <span
                  ><strong>Start:</strong>
                  {{ toLocalISODateString(sub.startDate) }}</span
                >
                <span
                  ><strong>End:</strong>
                  {{ toLocalISODateString(sub.currentPeriodEnd) }}</span
                >
                <span><strong>StripeId:</strong> {{ sub.stripeId }}</span>
              </div>
            </div>
          </div>

          <div class="additional_info">
            <!-- Tabs -->
            <div class="button_group">
              <button
                :class="{ active: activeList === 'users' }"
                @click="activeList = 'users'"
              >
                Users
              </button>
              <button
                :class="{ active: activeList === 'sessions' }"
                @click="activeList = 'sessions'"
              >
                Sessions
              </button>
            </div>

            <div class="users_info" v-if="activeList === 'users'">
              <div class="users_wrapper">
                <div
                  class="user_card"
                  v-for="(user, idx) in props.seller.users"
                  :key="idx"
                >
                  <div class="user_main">
                    <span class="user_name">{{ user.name }}</span>
                    <span class="user_email">{{ user.email }}</span>
                    <span class="user_date">{{
                      toLocalISODateString(user.createdAt)
                    }}</span>
                  </div>
                  <div class="user_actions">
                    <button
                      @click="showUserSection(user, 'payments')"
                      :class="{
                        active:
                          selectedUser?.id === user.id &&
                          activeUserSection === 'payments',
                      }"
                    >
                      Payments
                    </button>
                    <button
                      @click="showUserSection(user, 'subscriptions')"
                      :class="{
                        active:
                          selectedUser?.id === user.id &&
                          activeUserSection === 'subscriptions',
                      }"
                    >
                      Subscriptions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="sessions_info" v-else>
              <div class="sessions_wrapper">
                <div
                  class="session_card"
                  v-for="(session, idx) in props.seller.sessions"
                  :key="idx"
                >
                  <div class="session_main">
                    <span><strong>Status:</strong> {{ session.status }}</span>
                    <span
                      ><strong>Email:</strong> {{ session.clientEmail }}</span
                    >
                    <span
                      ><strong>Amount:</strong>
                      {{ session.amountTotal / 100 }} USD</span
                    >
                    <span
                      ><strong>Created:</strong>
                      {{ toLocalISODateString(session.createdAt) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const modalStore = useModalStore();
const activeList = ref("users");

const selectedUser = ref<any | null>(null);
const activeUserSection = ref<"payments" | "subscriptions" | null>(null);

function showUserSection(user, section ) {
  if (
    selectedUser.value?.id === user.id &&
    activeUserSection.value === section
  ) {
    selectedUser.value = null;
    activeUserSection.value = null;
  } else {
    selectedUser.value = user;
    activeUserSection.value = section;
  }
}

watch(activeList, () => {
  selectedUser.value = null;
  activeUserSection.value = null;
});
</script>

<style lang="scss" scoped>
.modal {
  position: relative;
  @media screen and (max-width: 768px) {
    & {
      align-items: flex-start;
    }
  }
}

.modal_content {
  padding: 1.5rem;
  position: relative;
  flex: 1;
  height: 100%;
  overflow-x: hidden;

  @media screen and (max-width: 768px) {
    & {
      padding: 3rem 0.5rem;
    }
  }
}

.grid_container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  max-width: 100%;
  transition: all ease 0.3s;
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 2rem;
}

.seller_info {
  max-width: 100%;
  position: relative;
  .top_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-bottom: 1rem;
      object-fit: cover;
    }

    .seller_data {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .seller_name {
        font-size: 1.2rem;
        font-weight: 600;
      }

      .info_row {
        font-size: 0.9rem;
        span:first-child {
          font-weight: 600;
        }
      }
    }
  }
  .user_section {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: #f9f9f9;

    h3 {
      margin-bottom: 0.5rem;
    }

    .section_card {
      padding: 0.8rem;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      width: 100%;
      max-width: 100%;
      flex: unset;

      @media screen and (max-width: 768px) {
        & {
          flex-direction: column;
        }
      }
    }
  }
}

.additional_info {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 1rem;

  .button_group {
    display: flex;
    gap: 1rem;

    button {
      flex: 1;
      padding: 0.6rem;
      border: none;
      border-radius: 8px;
      background: #f3f3f3;
      cursor: pointer;
      font-weight: 600;
      transition: 0.2s;

      &.active {
        background: var(--text-color);
        color: #fff;
      }
    }
  }

  .users_wrapper,
  .sessions_wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .user_card {
    @media screen and (max-width: 450px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .user_card,
  .session_card {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    background: #fafafa;

    .user_main,
    .session_main {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .user_actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      button {
        padding: 0.4rem 0.8rem;
        border: none;
        border-radius: 6px;

        cursor: pointer;

        background: #fff;
        color: var(--text-color);
        border: 1px solid var(--text-color);

        &.active {
          background: var(--text-color);
          border: 1px solid transparent;

          color: #fff;
        }
      }
    }
  }
}

.user_card,
.session_card,
.section_card {
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {
  .grid_container {
    grid-template-columns: 1fr;
  }
}
</style>
