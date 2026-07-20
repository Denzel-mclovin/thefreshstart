<template>
  <section class="scheduled_call">
    <div class="conntainer">
      <div class="scheduled_content">
        <div class="scheduled_content_head">
          <div class="success_labe">
            <div class="bg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <g clip-path="url(#clip0_380_8595)">
                  <path
                    d="M8.33398 20.0001L16.6673 28.3334L33.334 11.6667"
                    stroke="#F9F9F9"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_380_8595">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <div class="text_content">
            <h1>Your Call Is Scheduled!</h1>

            <p>
              You'll be meeting with Vito from our team. Watch the short video
              below before you talk. It'll tell you exactly what to expect and
              make your time together as productive as possible."
            </p>
          </div>
        </div>
        <VideoItem />
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.scheduled_call {
  @include mixins.component-spacing;
}

.scheduled_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;

  &_head {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    height: auto;
    gap: 20px;
  }

  .success_labe {
    width: 110px;
    height: 110px;
    aspect-ratio: 1/1;
    background: rgba(0, 51, 35, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .bg {
      width: 90px;
      height: 90px;
      aspect-ratio: 1/1;
      background: var(--dark-green);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: clamp(28px, 8vw, 40px);
        height: clamp(28px, 8vw, 40px);
      }

      @media screen and (max-width: 768px) {
        width: 85px;
        height: 85px;
      }
      @media screen and (max-width: 480px) {
        width: 75px;
        height: 75px;
      }
    }

    @media screen and (max-width: 768px) {
      width: 100px;
      height: 100px;
    }
    @media screen and (max-width: 480px) {
      width: 90px;
      height: 90px;
    }
  }

  .text_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;

    h1 {
      @include mixins.fz-h1($color: var(--dark-green));
      text-align: center;
    }

    p {
      @include mixins.fz-body-large($color: var(--dark-green));
      text-align: center;
    }
  }

  @media screen and (max-width: 1024px) {
    gap: 45px;
  }

  @media screen and (max-width: 768px) {
    gap: 30px;
  }

  @media screen and (max-width: 480px) {
    gap: 20px;
  }

  @media screen and (max-width: 375px) {
    gap: 15px;
  }
}
</style>
