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
@use '../../styles/mixins' as mixins;

.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--soft-white);
  font-family: var(--font-aeonik);

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
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1em;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-medium);
    background: var(--white);
    box-shadow: var(--shadow-card);
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
      @include mixins.fz-h3($color: var(--text-primary));
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
    border: 2px solid var(--gray-4);
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
    border: solid var(--white);
    border-width: 0 2px 2px 0;
    top: 2px;
    left: 5px;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .box input[type="checkbox"]:checked {
    background: var(--emerald-green);
    border-color: var(--emerald-green);
  }

  .box input[type="checkbox"]:checked::after {
    opacity: 1;
  }

  .box label {
    @include mixins.caption-font($color: var(--text-secondary));
    cursor: pointer;
    position: relative;
    top: 0;
    left: 0;
  }

  input[type="text"],
  input[type="password"],
  input[type="email"] {
    width: 100%;
    padding: 13px 14px;
    font-family: var(--font-aeonik);
    font-size: var(--text-sm);
    color: var(--text-primary);
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-small);
    background: var(--soft-white);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

    &:focus {
      border-color: var(--emerald-green);
      box-shadow: 0 0 0 3px rgba(0, 221, 120, 0.12);
      background: var(--white);
    }
  }

  label {
    position: absolute;
    left: 14px;
    top: 13px;
    color: var(--gray-5);
    font-family: var(--font-aeonik);
    font-size: var(--text-sm);
    pointer-events: none;
    transition: 0.2s ease all;
  }

  label.active {
    top: -8px;
    left: 10px;
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: var(--white);
    padding: 0 4px;
    color: var(--text-secondary);
  }

  .error {
    color: var(--danger);
    font-size: var(--text-xs);
    margin-top: 4px;
  }

  .radio_group p {
    margin-bottom: 0.5em;
    font-weight: var(--font-bold);
  }

  .login_buttons {
    width: 100%;

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
