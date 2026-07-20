<template>
  <div class="video_block">
    <ClientOnly>
      <div class="wistia-wrapper">
        <wistia-player
          ref="playerRef"
          media-id="mi2sa50wnp"
          silent-autoplay
          playsinline
          fit-strategy="cover"
          @loadedmetadata="onLoaded"
        />
      </div>
    </ClientOnly>

    <Transition name="fade">
      <div 
        v-if="showOverlay"
        class="video_control"
        :style="{
            '--overlay-background': showOverlay
            ? 'linear-gradient(180deg, rgba(0,0,0,0) -25.08%, #000 125.76%)'
            : 'transparent'
        }"
    >
        <button class="play_button" @click="enableSound">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M7.49902 5.00279V25.0028C7.49896 25.2252 7.55824 25.4436 7.67075 25.6355C7.78326 25.8273 7.94492 25.9857 8.13905 26.0942C8.33319 26.2027 8.55277 26.2575 8.77513 26.2529C8.99749 26.2482 9.21459 26.1843 9.40402 26.0678L25.654 16.0678C25.836 15.956 25.9863 15.7993 26.0906 15.6129C26.1949 15.4265 26.2496 15.2164 26.2496 15.0028C26.2496 14.7892 26.1949 14.5791 26.0906 14.3927C25.9863 14.2062 25.836 14.0496 25.654 13.9378L9.40402 3.93779C9.21459 3.82125 8.99749 3.75736 8.77513 3.75271C8.55277 3.74807 8.33319 3.80284 8.13905 3.91137C7.94492 4.0199 7.78326 4.17827 7.67075 4.37012C7.55824 4.56198 7.49896 4.78038 7.49902 5.00279Z"
              fill="#003323"
            />
          </svg>
        </button>

        <div class="text_description">
          <h3>Wistia Video Player</h3>
          <p>Tap to listen with sound</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const showOverlay = ref(true);
const playerRef = ref<any>(null);
const preview = ref("");

const onLoaded = () => {
  const player = playerRef.value

  preview.value = player.thumbnailUrl
}

const loadScript = (src: string, type?: string) => {
  return new Promise<void>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    if (type) script.type = type;

    script.onload = () => resolve();

    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await loadScript("https://fast.wistia.com/player.js");

  await loadScript("https://fast.wistia.com/embed/mi2sa50wnp.js", "module");
});

const enableSound = async () => {
  const player = playerRef.value;

  if (!player) return;

  player.pause?.();

  player.currentTime = 0;

  player.muted = false;

  await player.play?.();

  showOverlay.value = false;
};
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.video_block {
  width: 100%;
  height: auto;
  position: relative;
  background: url(v-bind(preview));
  background-color: var(--dark-green);
  background-size: cover;
  max-width: 1240px;
  max-height: 660px;
  aspect-ratio: 5/3;
  margin: 0 auto;
  border-radius: 15px;
}

.video_control {
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  gap: 20px;

  .play_button {
    background: rgba(255, 255, 255, 0.55);
    width: clamp(54px, 10vw, 100px);
    height: clamp(54px, 10vw, 100px);
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: relative;
    z-index: 1;

    svg {
      width: clamp(35px, 3vw, 50px);
      height: clamp(35px, 3vw, 50px);
    }
  }

  .bg {
    width: clamp(44px, 8vw, 80px);
    height: clamp(44px, 8vw, 80px);
    background: var(--soft-white);
    aspect-ratio: 1/1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text_description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    gap: 10px;

    @media screen and (max-width: 768px) {
      gap: 8px;
    }

    @media screen and (max-width: 480px) {
      gap: 5px;
    }
  }

  h3 {
    @include mixins.fz-h3($color: #fff);
  }

  p {
    @include mixins.fz-body(
      $color: var(--gray-3),
      $size: clamp(0.75rem, 2.5vw, 1rem)
    );
  }

  @media screen and (max-width: 768px) {
    gap: 15px;
  }

  @media screen and (max-width: 480px) {
    gap: 10px;
  }
}
.wistia-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  position: absolute;
  inset: 0;

  wistia-player {
    width: 100%;
    height: 100%;
  }
}

.wistia-wrapper video {
  object-fit: cover;
}

.video_control::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--overlay-background);
    border-radius: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
