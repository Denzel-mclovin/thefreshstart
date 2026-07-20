<template>
  <div class="modal">
    <div class="modal_wrapper">
      <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
        Get subscription link
      </SharedModalHead>

      <div v-if="loader" class="loader mt-20"> 
        <SharedLoader />
      </div>

      
      <div class="modal_content" v-else>

         

        <div class="tittle_block">
          <h1>Seller information</h1>
          <div 
            class="mail_status"
            v-if="resStatus"
          >
            <span
              class="success_email"
              v-if="emailStatus"
            >
              Email sent successfully
            </span>
            <span
              class="email_failed"
              v-else
            >
              Email sent failed
            </span>
          </div>
        </div>
       
        <div class="flex_items">
          <div class="modelValue_group">
            <input
              type="text"
              v-model="sellerName"
              @focus="focused.sellerName = true"
              @blur="focused.sellerName = false"
              @input="sellerNameValidation"
            />

            <label :class="{ active: focused.sellerName || sellerName }"
              >Enter seller name</label
            >
            <span class="error" v-if="errors.sellerName">{{
              errors.sellerName
            }}</span>
          </div>

          <div class="modelValue_group">
            <input
              type="text"
              v-model="sellerLastName"
              @focus="focused.sellerLastName = true"
              @blur="focused.sellerLastName = false"
              @input="sellerLastNameValidation"
            />

            <label :class="{ active: focused.sellerLastName || sellerLastName }"
              >Enter seller last name</label
            >
            <span class="error" v-if="errors.sellerLastName">{{
              errors.sellerLastName
            }}</span>
          </div>
        </div>

        <div class="modelValue_group">
          <input
            type="text"
            v-model="sellerEmail"
            @focus="focused.sellerEmail = true"
            @blur="focused.sellerEmail = false"
            @input="sellerEmailValidation"
          />

          <label :class="{ active: focused.sellerEmail || sellerEmail }"
            >Enter seller email</label
          >
          <span class="error" v-if="errors.sellerEmail">{{
            errors.sellerEmail
          }}</span>
        </div>

        <h1>Buyer information</h1>

        <div class="flex_items">
          <div class="modelValue_group">
            <input
              type="text"
              v-model="emailValue"
              @focus="focused.email = true"
              @blur="focused.email = false"
              @input="emailValidation"
            />

            <label :class="{ active: focused.email || emailValue }"
              >Enter user email</label
            >
            <span class="error" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="modelValue_group">
            <input
              type="text"
              v-model="clientName"
              @focus="focused.clientName = true"
              @blur="focused.clientName = false"
              @input="clientNameValidation"
            />

            <label :class="{ active: focused.clientName || clientName }"
              >Enter user name</label
            >
            <span class="error" v-if="errors.clientName">{{
              errors.clientName
            }}</span>
          </div>
        </div>

        <div class="modelValue_group">
          <select
            v-model="discountSize"
            @focus="focused.discountSize = true"
            @blur="focused.discountSize = false"
            @change="discountSizeValidation"
          >
            <option v-for="n in sizes" :key="n" :value="n">
              {{ n }}
            </option>
          </select>

          <label
            v-if="discountSize === ''"
            :class="{ active: focused.discountSize || discountSize }"
          >
            Select discount size
          </label>
          <span class="error" v-if="errors.discountSize">{{
            errors.discountSize
          }}</span>
        </div>

        <div class="receivedLink" v-if="resStatus">
          <span> Received payment link </span>
          <div class="link_item">
            <p>
              {{ resLink.slice(0, 25) + '...' }}
            </p>
            <SharedDefaultBtn 
            @click="copyLinkHandler"
            >
              Copy link
            </SharedDefaultBtn>

          </div>
          
        </div>
      </div>

      <div class="bottom_content">
        <SharedDefaultBtn
          style="pointer-events: none; opacity: 0.5"
          class="btn-disabled"
          v-if="!isValid"
        >
          Get link
        </SharedDefaultBtn>
        <SharedDefaultBtn class="btn-active" @click="getPaymentLink" v-else>
          Get link
        </SharedDefaultBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const modalStore = useModalStore();

const emailValue = ref("");
const discountSize = ref("");
const sellerName = ref("");
const sellerLastName = ref("");
const sellerEmail = ref("");
const clientName = ref("");

const loader = ref(false);

const resStatus = ref(false);
const emailStatus = ref(null);
const resLink = ref("");

const errors = reactive({
  sellerName: "",
  sellerLastName: "",
  sellerEmail: "",
  email: "",
  discountSize: "",
  clientName: "",
});
const focused = reactive({
  sellerName: false,
  sellerLastName: false,
  sellerEmail: false,
  email: false,
  discountSize: false,
  clientName: false,
});
const sizes = Array.from(
  { length: Math.floor(275 / 25) + 1 },
  (_, i) => i * 25
);

const props = defineProps({
  priceId: {
    type: String,
    required: true,
  },
});

const copyLinkHandler = async () => {
  try {
    await navigator.clipboard.writeText(resLink.value);
    alert("Link copied");
  } catch (err) {
    console.log(err);
  }
}

const sellerEmailValidation = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sellerEmail.value)) {
    errors.sellerEmail = "Enter correct email";
    return false;
  } else {
    errors.sellerEmail = "";
    return true;
  }
};

const sellerNameValidation = () => {
  if (!sellerName.value || sellerName.value.length < 2) {
    errors.sellerName = "Please enter your name";
    return false;
  } else {
    errors.sellerName = "";
    return true;
  }
};

const clientNameValidation = () => {
  if (!clientName.value || clientName.value.length < 2) {
    errors.clientName = "Please enter client name";
    return false;
  } else {
    errors.clientName = "";
    return true;
  }
};

const sellerLastNameValidation = () => {
  if (!sellerLastName.value || sellerLastName.value.length < 2) {
    errors.sellerLastName = "Please enter your last name";
    return false;
  } else {
    errors.sellerLastName = "";
    return true;
  }
};

const emailValidation = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailValue.value)) {
    errors.email = "Enter correct email";
    return false;
  } else {
    errors.email = "";
    return true;
  }
};

const discountSizeValidation = () => {
  if (discountSize.value === "") {
    errors.discountSize = "Please select a discount size";
    return false;
  } else {
    errors.discountSize = "";
    return true;
  }
};

const isValid = computed(() => {
  return (
    emailValidation() &&
    discountSizeValidation() &&
    sellerEmailValidation() &&
    sellerNameValidation() &&
    sellerLastNameValidation() &&
    clientNameValidation()
  );
});

const getPaymentLink = async () => {

  loader.value = true;

  try {
    const getLink = await $fetch("/api/payments", {
      method: "POST",
      params: {
        method: "get-payment-link",
      },
      body: {
        email: emailValue.value,
        priceId: props.priceId,
        discountSize: discountSize.value,
        clientName: clientName.value,
        sellerName: sellerName.value,
        sellerLastName: sellerLastName.value,
        sellerEmail: sellerEmail.value,
      },
    });

    console.log(getLink, "getLink");

    if (getLink.statusCode === 200) {
      resLink.value = getLink.url;
      emailStatus.value = getLink.emailStatus;
      resStatus.value = true;
    } else {
      emailStatus.value = getLink.emailStatus;
      resStatus.value = false;
    }
  } catch (err) {
    console.log(err, "err");

  }

  loader.value = false;

};
</script>

<style scoped lang="scss">
.modal_wrapper {
  position: relative;
  height: 100%;
}


.flex_items {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  gap: 1em;

  .modelValue_group {
    flex: 1;
  }

  @media screen and (max-width: 768px) {
    & {
      flex-direction: column;
      gap: 1.5em;
    }
  }
}

select {
  width: 100%;
  padding: 12px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  background: white;
  appearance: none;
}

select:focus {
  border-color: #666;
}

.modelValue_group {
  position: relative;
  width: 100%;
}

input[type="text"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 12px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

label {
  position: absolute;
  left: 12px;
  top: 12px;
  color: #888;
  pointer-events: none;
  transition: 0.2s ease all;
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
  color: red;
  font-size: 12px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -20px;
}

.modal_content {
  width: 100%;
  position: relative;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5em;

  @media screen and (max-width: 768px) {
    & {
      padding: 0;
      width: 90%;
      height: 100%;
      overflow-y: scroll;
      justify-content: flex-start;
      padding: 2em 0;
      margin: 0 auto;
    }
  }
}

.tittle_block{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mail_status{
  font-weight: 500;
  font-size: 1em;
  .success_email{
    color: rgb(9, 156, 9);
  }
  .email_failed{
    color: red;
  }
}

.receivedLink {
  width: 100%;
  .link_item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }
  p {
    width: 100%;
    height: auto;
    word-break: break-all;
    color: #666;
    font-weight: 400;
    font-size: 1.2em;
  }

}

.bottom_content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1em;
  gap: 1em;
  @media screen and (max-width: 768px) {
    padding-bottom: 4rem;
  }
}
</style>
