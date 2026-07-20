<template>
  <div class="login">
    <div class="tooltip_wrapper">
      <div class="tooltip_item">
        <span class="tooltip_type"> Error : </span>
        <span class="tooltip_message"> fglgmzerlmlemlemgsrlgm </span>
      </div>
    </div>
    <div class="login_container">
      <div v-if="loading" class="loader" :class="{ active_loader: loading }">
        <SharedLoader />
      </div>

      <div class="login_content" v-else>
        <div class="login_head">
          <span> Enter to admin panel </span>
        </div>

        <div class="login_content">
          <div class="modelValue_group">
            <input
              type="text"
              v-model="formValue.username"
              @focus="focused.username = true"
              @blur="
                touched.username = true;
                focused.username = false;
              "
            />

            <label :class="{ active: focused.username || formValue.username }"
              >Username</label
            >
            <span class="error" v-if="errors.username">{{
              errors.username
            }}</span>
          </div>

          <div class="modelValue_group">
            <input
              :type="hiddenPassword ? 'password' : 'text'"
              v-model="formValue.password"
              @focus="focused.password = true"
              @blur="
                focused.password = false;
                touched.password = true;
              "
            />
            <label :class="{ active: focused.password || formValue.password }"
              >Password</label
            >
            <span class="error" v-if="errors.password">{{
              errors.password
            }}</span>
          </div>

          <div class="checkBox_group">
            <div class="box">
              <input
                type="checkbox"
                id="rememberMe"
                v-model="formValue.rememberMe"
              />
              <label for="rememberMe">Remember me</label>
            </div>

            <div class="box">
              <input
                type="checkbox"
                id="togglePassword"
                v-model="hiddenPassword"
              />
              <label for="togglePassword">
                {{ hiddenPassword ? "Hide password" : "Show password" }}
              </label>
            </div>
          </div>
        </div>

        <div class="login_buttons">
          <SharedDefaultBtn
            :class="validForm ? 'active_btn' : 'hidden_btn'"
            :disabled="!validForm"
            @click="login"
          >
            Log in
          </SharedDefaultBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const hiddenPassword = ref(true);
const loading = ref(false);

const auth = useAuthStore();

const formValue = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const errors = ref({
  username: "",
  password: "",
});

const touched = ref({
  username: false,
  password: false,
});

const focused = ref({
  username: false,
  password: false,
});

const validForm = computed(() => {
  if (touched.value.username) {
    errors.value.username =
      formValue.value.username.length < 5
        ? "Username must be at least 5 characters"
        : "";
  } else {
    errors.value.username = "";
  }

  if (touched.value.password) {
    errors.value.password =
      formValue.value.password.length < 5
        ? "Password must be at least 5 characters"
        : "";
  } else {
    errors.value.password = "";
  }

  return !errors.value.username && !errors.value.password;
});

const login = async () => {

  try {
    const res = await $fetch("/api/auth", {
      method: "POST",
      params: {
        method: "admin_login",
      },
      body: {
        username: formValue.value.username,
        password: formValue.value.password,
        rememberMe: formValue.value.rememberMe,
      },
    });

    if (!res.success) {
      alert(res.message);
      return;
    }

    auth.setRole("admin");


    await navigateTo("/admin");
  } catch (err) {
    alert(`Something went wrong, ${err}`);
  }
};

definePageMeta({
  layout: false,
});
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .tooltip_wrapper {
    display: none;
  }

  .modelValue_group {
    position: relative;
    width: 100%;
  }

  .login_container {
    width: clamp(300px, 40vw, 500px);
    height: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1em;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    position: relative;

    @media screen and (max-width: 768px) {
      & {
        width: 100vw;
        height: 100vh;
        border-radius: unset;
      }
    }
  }

  .login_head {
    width: 100%;
    text-align: center;
    span {
      font-size: 1.5em;
      font-weight: 500;
      color: var(--text-color);
      text-align: center;
    }
  }

  .login_content {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2em;
  }

  .checkBox_group {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    gap: 0.5em;
    cursor: pointer;
  }

  .box input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #555;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .box input[type="checkbox"]::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 10px;
    border: solid var(--text-color);
    border-width: 0 2px 2px 0;
    top: 2px;
    left: 5px;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .box input[type="checkbox"]:checked {
    background: #e3f2fd;
    border-color: var(--text-color);
  }

  .box input[type="checkbox"]:checked::after {
    opacity: 1;
  }

  .box label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    position: relative;
    top: 0;
    left: 0;
  }

  input[type="text"],
  input[type="password"],
  input[type="email"] {
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
    margin-top: 4px;
  }

  .radio_group p {
    margin-bottom: 0.5em;
    font-weight: 500;
  }

  .login_buttons {
    .hidden_btn {
      opacity: 0.3;
      pointer-events: none;
    }

    .active_btn {
      opacity: 1;
      pointer-events: all;
    }
  }
}
</style>
