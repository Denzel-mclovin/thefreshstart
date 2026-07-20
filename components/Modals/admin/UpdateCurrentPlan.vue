<template>
  <div class="modal">
    <div class="modal_wrapper">
      <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
        Update current plan
      </SharedModalHead>

      <div class="modal_content">
        <div class="modelValue_group">
          <input
            type="text"
            v-model="formValue.planName"
            @focus="focused.planName = true"
            @blur="focused.planName = false"
          />

          <label :class="{ active: focused.planName || formValue.planName }"
            >Plan name (optional)</label
          >
          <span class="error" v-if="errors.planName">{{
            errors.planName
          }}</span>
        </div>

        <!-- Ammount -->

        <div
          class="amount flex justify-between gap-2 items-center w-full h-auto"
        >
          <div class="modelValue_group">
            <input
              type="number"
              v-model="formValue.amount"
              @focus="focused.amount = true"
              @blur="focused.amount = false"
              @input="amountValidation"
            />

            <label :class="{ active: focused.amount || formValue.amount }"
              >Amount <span class="text-red-700">( required ) !</span></label
            >
            <span class="error" v-if="errors.amount">{{ errors.amount }}</span>
          </div>

          <div class="modelValue_group">
            <input
              type="text"
              v-model="formValue.priceId"
              @focus="focused.priceId = true"
              @blur="focused.priceId = false"
              @input="priceIdValidation"
            />

            <label :class="{ active: focused.priceId || formValue.priceId }"
              >Price ID <span class="text-red-700">( required ) !</span></label
            >
            <span class="error" v-if="errors.priceId">{{
              errors.priceId
            }}</span>
          </div>
        </div>

        <div class="modelValue_group">
          <textarea
            v-model="formValue.description"
            @focus="focused.description = true"
            @blur="focused.description = false"
            name="description"
            id="description"
            rows="5"
          />

          <label
            id="description"
            :class="{ active: focused.description || formValue.description }"
          >
            Description (optional)</label
          >
          <span class="error" v-if="errors.description">{{
            errors.description
          }}</span>
        </div>

        <div class="modelValue_group">
          <input
            type="text"
            v-model="formValue.paymentLink"
            @focus="focused.paymentLink = true"
            @blur="focused.paymentLink = false"
            @input="paymentLinkValidation"
          />

          <label
            :class="{ active: focused.paymentLink || formValue.paymentLink }"
            >Payment link from Stripe
            <span class="text-red-700">( required ) !</span></label
          >
          <span class="error" v-if="errors.paymentLink">{{
            errors.paymentLink
          }}</span>
        </div>
      </div>

      <div class="bottom_content">
        <SharedDefaultBtn
          style="pointer-events: none; opacity: 0.5"
          class="btn-disabled"
          v-if="!isFormValid"
        >
          Update plan
        </SharedDefaultBtn>
        <SharedDefaultBtn class="btn-active" @click="sendForm" v-else>
          Update plan
        </SharedDefaultBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const props = defineProps({
  planId: {
    type: String,
    required: true,
  },
});

const modalStore = useModalStore();
const planStore = usePlanStore();

const formValue = ref({
  planName: "",
  amount: 0,
  priceId: "",
  description: "",
  paymentLink: "",
});

const errors = reactive({
  planName: "",
  amount: "",
  priceId: "",
  description: "",
  paymentLink: "",
});
const focused = reactive({
  planName: false,
  amount: false,
  priceId: false,
  description: false,
  paymentLink: false,
});

const amountValidation = () => {
  if (formValue.value.amount < 1) {
    errors.amount = "Monthly amount is required and must be bigger than 0";
    return false;
  } else {
    errors.amount = "";
    return true;
  }
};

const paymentLinkValidation = () => {
  if (!formValue.value.paymentLink) {
    errors.paymentLink = "Payment link is required";
    return false;
  } else {
    errors.paymentLink = "";
    return true;
  }
};

const priceIdValidation = () => {
  if (formValue.value.priceId.length < 1) {
    errors.priceId = "Price ID is required";
    return false;
  } else {
    errors.priceId = "";
    return true;
  }
};

const isFormValid = computed(() => {
  return amountValidation() && priceIdValidation() && paymentLinkValidation();
});

const sendForm = async () => {
  const readyPlanName =
    formValue.value.planName.length < 1 ? "Coaching" : formValue.value.planName;

  const planId = props.planId;
  const data = {
    subName: readyPlanName,
    amount: +formValue.value.amount,
    priceId: formValue.value.priceId.trim(),
    subDescription: formValue.value.description,
    paymentLink: formValue.value.paymentLink.trim(),
  };

  try {
    const sendData = await planStore.updateCurrentPlan(planId, data);

    if (sendData === 200) {
      alert("Plan updated successfully");
      formValue.value = {
        planName: "",
        amount: 0,
        priceId: "",
        description: "",
        paymentLink: "",
      };
    }

    modalStore.closeModal();
  } catch (error) {
    console.log(error, "error");
  }
};
</script>

<style scoped lang="scss">
.modal {
  @media screen and (max-width: 768px) {
    & {
      align-items: flex-start;
    }
  }
}

.modal_wrapper {
  @media screen and (max-width: 768px) {
    & {
      height: auto;
      padding-bottom: 4rem;
    }
  }
}

.modal_content {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  padding: 3em;
  gap: 1.5em;
  width: 80%;
  position: relative;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    & {
      width: 95%;
      padding: 0.5rem;
      justify-content: flex-start;
      padding-block: 3rem;
      overflow-y: scroll;
    }
  }

  .amount {
    @media screen and (max-width: 768px) {
      & {
        flex-direction: column;

        gap: 2rem;
      }
    }
  }
}

.modelValue_group {
  position: relative;
  width: 100%;
}

input[type="text"],
input[type="number"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 12px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

textarea {
  resize: none;
}

label {
  position: absolute;
  left: 12px;
  top: 12px;
  color: #888;
  pointer-events: none;
  transition: 0.2s ease all;

  @media screen and (max-width: 768px) {
    & {
      font-size: 12px;
    }
  }
}

label.active {
  top: -8px;
  left: 8px;
  font-size: 12px;
  background: white;
  padding: 0 4px;
  color: #333;
}

.error {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -25px;
  color: red;
  font-size: 12px;
  margin-top: 4px;
  //   min-height: 16px;
}

.bottom_content {
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--text-color);
  gap: 1em;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
  -webkit-appearance: none;
}
</style>
