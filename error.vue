<template>
  <section class="not-found">
    <div class="not-found_glow" aria-hidden="true" />

    <div class="not-found_content">

      <h1 class="not-found_code">
        {{ isNotFound ? "404" : (error?.statusCode ?? "500") }}
      </h1>

      <h2 class="not-found_title">
        {{
          isNotFound
            ? "This page stepped away from its desk."
            : "Something went sideways."
        }}
      </h2>

      <p class="not-found_desc">
        {{
          isNotFound
            ? "The link you followed doesn't lead anywhere anymore. Rest of the site is still online though."
            : "An unexpected error happened on our end. Try again, or head back home."
        }}
      </p>

      <div class="not-found_actions">
        <button class="not-found_btn-primary" @click="goHome">
          Back to home
        </button>
        <button class="not-found_btn-text" @click="handleError">
          Try again
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const isNotFound = computed(
  () => props.error?.statusCode === 404 || !props.error?.statusCode,
);

const goHome = () => clearError({ redirect: "/" });
const handleError = () => clearError({ redirect: "/" });
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.not-found {
  @include mixins.page-spacing;
  position: relative;
  width: 100%;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--soft-white);
  padding: 40px 24px;
  box-sizing: border-box;
  margin-top: 0 !important;

  &_glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(900px, 140vw);
    height: min(900px, 140vw);
    transform: translate(-50%, -52%);
    background: radial-gradient(
      circle,
      var(--surface-green) 0%,
      rgba(232, 246, 237, 0.4) 45%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  &_content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 560px;
  }

  &_status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: var(--white);
    @include mixins.caption-font($color: var(--text-secondary));
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 28px;

    &_dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--emerald-green);
      box-shadow: 0 0 0 0 rgba(0, 221, 120, 0.5);
      animation: pulse 2.2s ease-out infinite;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }
  }

  &_code {
    font-family: var(--font-aeonik, sans-serif);
    font-weight: 700;
    font-size: clamp(4.5rem, 14vw, 8rem);
    line-height: 1;
    color: var(--dark-green);
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }

  &_title {
    @include mixins.fz-h3($color: var(--dark-green));
    font-weight: 700;
    margin: 0 0 12px;
    max-width: 20ch;
  }

  &_desc {
    @include mixins.fz-body($color: var(--text-secondary));
    margin: 0 0 36px;
    max-width: 42ch;
  }

  &_actions {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  &_btn-primary {
    @include mixins.button-primary;
  }

  &_btn-text {
    @include mixins.button-font;
    background: none;
    border: none;
    padding: 8px 4px;
    cursor: pointer;
    color: var(--text-secondary);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color ease 0.2s;

    &:hover {
      color: var(--dark-green);
    }
  }

  @media screen and (max-width: 480px) {
    &_actions {
      flex-direction: column;
      gap: 14px;
    }

    &_btn-primary {
      width: 100%;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 221, 120, 0.45);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 221, 120, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 221, 120, 0);
  }
}
</style>
