<template>
  <div class="modal">
    <div class="modal_wrapper">
      <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
        Booking details
      </SharedModalHead>

      <div class="details_wrapper">
        <div class="details_content">
          <div class="column main_column">
            <div class="column_head">
              <span class="accent_text">Main information:</span>
            </div>
            <div class="column_content">
              <NuxtImg
                src="/icons/default-user.webp"
                alt="avatar"
                width="100"
                height="100"
              />
              <div class="info">
                <span> Name: {{ props.name }}</span>
                <span> Language: {{ props.language }} </span>
                <span> Country: {{ props.country }} </span>
                <span> Time zone: {{ props.timeZone }} </span>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column_head">
              <span class="accent_text">Contact information:</span>
            </div>
            <div class="column_content">
              <span>Phone: {{ props.phone }}</span>
              <span>Email: {{ props.email }}</span>
              <span> Contact method: {{ props.contactMethod }} </span>
            </div>
          </div>
          <div class="column">
            <div class="column_head">
              <span class="accent_text">Callback information:</span>
            </div>
            <div class="column_content">
              <span> Time: {{ props.timeSlot }} </span>
              <span>
                Date: {{ toLocalISODateString(props.dateCallback) }}
              </span>
              <span> status: {{ props.status }} </span>
              <span>
                Created at: {{ toLocalISODateString(props.createdAt) }}
              </span>
            </div>
          </div>
        </div>
        <div class="user_comment">
          <div class="comment_title accent_text">User message:</div>
          <div class="inner_comment">
            {{ props.comment }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const modalStore = useModalStore();

const props = defineProps<{
  id: string;
  name: string;
  email: string;
  phone: string;
  comment: string;
  timeZone: string;
  country: string;
  language: string;
  contactMethod: string;
  dateCallback: string;
  timeSlot: string;
  createdAt: string;
  status: string;
}>();
</script>

<style scoped lang="scss">
.modal {
  @media screen and (max-width: 768px) {
    & {
      align-items: flex-start;
    }
  }
  .modal_wrapper {
    @media screen and (max-width: 768px) {
      & {
        padding-bottom: 4rem;
      }
    }
  }
}
.details_wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: normal;
  @media screen and (max-width: 768px) {
    & {
      overflow-y: scroll;
    }
  }
}

.details_content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
  padding: 2em 1em;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2em;
  }
}

.user_comment {
  margin: 0 1em;
  padding-bottom: 1em;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3em;
}

.column_content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;

  @media (max-width: 768px) {
    align-items: stretch;
  }
}

.main_column {
  .column_content {
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
  }
}

.user_comment {
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: normal;
  padding-bottom: 2rem;
  gap: 1em;

  .inner_comment {
    background: rgba(163, 51, 255, 0.1);
    padding: 1em;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    flex: 1;
  }
}

.accent_text {
  color: var(--text-color);
  font-weight: 600;
  font-size: 1em;
}
</style>
