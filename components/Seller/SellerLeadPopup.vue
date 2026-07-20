<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="popup">
        <button class="close" @click="emit('close')">✕</button>

        <div class="popup__header">
          <div class="popup__avatar">
            {{ getInitials(lead.firstName, lead.lastName) }}
          </div>

          <div>
            <h2>
              {{ lead.firstName || "No Name" }}
              {{ lead.lastName }}
            </h2>

            <p>{{ lead.phone || lead.email }}</p>
          </div>
        </div>

        <div class="popup__grid">
          <div class="field">
            <span>Phone</span>
            <strong>{{ lead.phone || "—" }}</strong>
          </div>

          <div class="field">
            <span>Email</span>
            <strong>{{ lead.email || "—" }}</strong>
          </div>

          <div class="field">
            <span>Created</span>
            <strong>{{ formatDate(lead.createdAt) }}</strong>
          </div>

          <div class="field">
            <span>Source</span>
            <strong>{{ lead.utmSource || "direct" }}</strong>
          </div>
        </div>

        <div class="answers">
          <h3>Quiz Answers</h3>

          <div v-for="answer in lead.answers" :key="answer.id" class="answer">
            <div class="question">
              {{ answer.question }}
            </div>

            <div class="result">
              {{ answer.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  lead: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}

function getInitials(first, last) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
}

.popup {
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background: #161b26;
  border: 1px solid #2a3144;
  border-radius: 18px;
  padding: 28px;
  color: white;
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #222838;
  color: white;
  cursor: pointer;
}

.popup__header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.popup__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #00e5c7;
  color: black;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 30px;
}

.field {
  padding: 14px;
  border-radius: 12px;
  background: #1e2433;
}

.field span {
  display: block;
  margin-bottom: 6px;
  color: #8892a4;
  font-size: 12px;
}

.answers h3 {
  margin-bottom: 16px;
}

.answer {
  padding: 16px;
  border-radius: 12px;
  background: #1e2433;
  margin-bottom: 12px;
}

.question {
  color: #8892a4;
  margin-bottom: 8px;
}

.result {
  font-weight: 600;
}
</style>
