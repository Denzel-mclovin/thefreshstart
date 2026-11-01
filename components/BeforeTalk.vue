<template>
  <section class="before-talk">
    <div class="before-talk__container">
      <h2 class="before-talk__title">
        Two things before we talk:
      </h2>

      <div class="before-talk__grid">
        <article class="card">
          <span class="card__number">1</span>
          <h3 class="card__title">Add the call to your calendar now so it doesn't slip.</h3>

          <div class="card__buttons">
            <a class="calendar-btn" href="#" target="_blank" rel="noopener noreferrer">
              <svg
                class="calendar-btn__icon calendar-btn__icon--google"
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
                <path d="M12 13.5v4M11 14.5l1-1" />
              </svg>
              <span>Google</span>
            </a>

            <a class="calendar-btn" href="#" target="_blank" rel="noopener noreferrer">
              <svg
                class="calendar-btn__icon"
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M16.5 12.8c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.3Z" />
                <path d="M14.5 5.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
              </svg>
              <span>Apple</span>
            </a>

            <a class="calendar-btn" href="#" target="_blank" rel="noopener noreferrer">
              <svg
                class="calendar-btn__icon calendar-btn__icon--outlook"
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
                <path d="M12 13.5v4M11 14.5l1-1" />
              </svg>
              <span>Outlook</span>
            </a>
          </div>
        </article>

        <article class="card">
          <span class="card__number">2</span>
          <h3 class="card__title">Write down your three real hesitations.</h3>
          <p class="card__text">
            Not logistics you could Google, but the things actually holding you back.
            Bring them, and we'll work through them together.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@use '../styles/mixins.scss' as mixins;

.before-talk {
  background-color: var(--light-grey);
  @include mixins.component-spacing;

  &__container {
    max-width: 1440px;
    margin-inline: auto;
    padding-inline: clamp(16px, 8.5vw, 100px);
  }

  &__title {
    @include mixins.fz-h1(var(--font-aeonik, sans-serif), 3rem, var(--dark-green));
    margin: 0 0 clamp(24px, 4vw, 48px);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: clamp(16px, 2vw, 24px);
  background-color: var(--soft-white);
  border: 1px solid var(--gray-2);
  border-radius: var(--radius-medium);

  &__number {
    @include mixins.fz-h6(var(--font-aeonik, sans-serif), 16px, var(--dark-green));
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--white);
    border: 1px solid var(--gray-2);
    border-radius: 10px;
    flex-shrink: 0;
  }

  &__title {
    @include mixins.fz-h5(var(--font-aeonik, sans-serif), clamp(1rem, 3vw, 1.25rem), var(--dark-green));
    margin: 0;
    margin-top: 8px;
  }

  &__text {
    @include mixins.fz-body(var(--font-aeonik, sans-serif), clamp(0.875rem, 2vw, 1rem), var(--text-secondary));
    margin: 0;
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.calendar-btn {
  @include mixins.button-outline(var(--soft-white), var(--font-aeonik, sans-serif), 16px);
  padding: 12px 16px;
  border-radius: var(--radius-small);
  text-decoration: none;
  color: var(--dark-green);

  &__icon {
    flex-shrink: 0;

    &--google {
      color: var(--danger);
    }

    &--outlook {
      color: #3b82f6;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 10px 14px;
    flex: 1 1 auto;
  }
}
</style>