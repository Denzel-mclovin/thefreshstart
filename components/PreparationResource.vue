<template>
  <section class="resource">
    <div class="conntainer">
      <div class="resource_content">
        <div class="resource_heading">
          <h1>Preparation Resources</h1>

          <p>Essential viewing to maximize our time together.</p>
        </div>

        <div class="resource_media">
          <div
            class="video_item"
            v-for="video in videoListData"
            :key="video.id"
          >
            <div class="video_item_content">
              <ClientOnly>
                <div
                  class="wistia-wrapper"
                  :class="{ active: activeVideo === video.id }"
                >
                  <wistia-player
                    :ref="(el) => setPlayer(video.id, el)"
                    :media-id="video.mediaId"
                    playsinline
                    fit-strategy="cover"
                  />
                </div>
              </ClientOnly>

              <img
                v-if="activeVideo !== video.id"
                class="video_item_preview"
                :src="video.previewLink"
                :alt="video.title"
              />

              <button
                class="video_item_play"
                @click="playVideo(video.id)"
                v-if="activeVideo !== video.id"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_444_383)">
                    <path
                      d="M5 3.33552V16.6689C4.99996 16.8171 5.03948 16.9627 5.11448 17.0906C5.18949 17.2185 5.29726 17.3241 5.42669 17.3965C5.55611 17.4688 5.70249 17.5053 5.85074 17.5022C5.99898 17.4991 6.14371 17.4566 6.27 17.3789L17.1033 10.7122C17.2247 10.6376 17.3249 10.5332 17.3944 10.4089C17.4639 10.2846 17.5004 10.1446 17.5004 10.0022C17.5004 9.85978 17.4639 9.71974 17.3944 9.59545C17.3249 9.47115 17.2247 9.36675 17.1033 9.29219L6.27 2.62552C6.14371 2.54783 5.99898 2.50523 5.85074 2.50213C5.70249 2.49904 5.55611 2.53555 5.42669 2.60791C5.29726 2.68026 5.18949 2.78584 5.11448 2.91374C5.03948 3.04165 4.99996 3.18725 5 3.33552Z"
                      fill="#F9F9F9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_444_383">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>

              <div class="video_item_timeline" v-if="activeVideo !== video.id">
                <div class="controls">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_444_377)">
                      <path
                        d="M4.5 3.00021V15.0002C4.49996 15.1337 4.53553 15.2647 4.60304 15.3798C4.67054 15.4949 4.76754 15.5899 4.88402 15.6551C5.0005 15.7202 5.13225 15.753 5.26566 15.7503C5.39908 15.7475 5.52934 15.7091 5.643 15.6392L15.393 9.63921C15.5022 9.57211 15.5924 9.47814 15.6549 9.36628C15.7175 9.25441 15.7503 9.12838 15.7503 9.00021C15.7503 8.87204 15.7175 8.74601 15.6549 8.63415C15.5924 8.52228 15.5022 8.42831 15.393 8.36121L5.643 2.36121C5.52934 2.29128 5.39908 2.25295 5.26566 2.25016C5.13225 2.24738 5.0005 2.28024 4.88402 2.34536C4.76754 2.41048 4.67054 2.50549 4.60304 2.62061C4.53553 2.73572 4.49996 2.86676 4.5 3.00021Z"
                        fill="#F9F9F9"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_444_377">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span> {{ video.duration }} </span>
                </div>
                <div class="timeline_item"></div>
              </div>
            </div>

            <div class="video_item_title">
              {{ video.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick } from "vue";

const activeVideo = ref(null);
const playerRef = ref(null);
const players = new Map();

const videoListData = [
  {
    id: 1,
    title: "Real Relocation Success Stories",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview1.png",
  },
  {
    id: 2,
    title: "Common Relocation Mistakes",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview2.png",
  },
  {
    id: 3,
    title: "Preparing Your Relocation Plan",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview3.png",
  },
  {
    id: 4,
    title: "Visa & Residency Essentials",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview4.png",
  },
  {
    id: 5,
    title: "Financial Planning Before Moving",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview5.png",
  },
  {
    id: 6,
    title: "Understanding Global Mobility & Residencies",
    mediaId: "mi2sa50wnp",
    duration: "8:00",
    previewLink: "./images/preview6.png",
  },
];

const setPlayer = (id, player) => {
  if (player) {
    players.set(id, player);
  } else {
    players.delete(id);
  }
};

const stopAllPlayers = () => {
  players.forEach((player) => {
    player.pause?.();
    player.currentTime = 0;
    player.muted = true;
  });
};

const playVideo = async (id) => {
  stopAllPlayers();

  activeVideo.value = id;

  const player = players.get(id);

  if (!player) return;

  player.pause?.();
  player.currentTime = 0;
  player.muted = false;

  await player.play?.();
};
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.resource {
  padding-block: 60px;
  width: 100%;
  height: auto;

  &_content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    width: 100%;
    height: 100%;
    gap: 40px;
  }

  &_heading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 10px;

    h1 {
      @include mixins.fz-h1($color: var(--dark-green));
    }

    p {
      @include mixins.fz-body($color: var(--dark-green));
    }

    @media screen and (max-width: 768px) {
      align-items: center;
    }
  }

  &_media {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-start;
    position: relative;
    width: 100%;
    height: auto;
    gap: 20px;

    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    @media screen and (max-width: 480px) {
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
    }
  }

  .video_item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    position: relative;
    cursor: pointer;
    gap: 16px;

    &_play {
      width: 70px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      background: rgba(0, 51, 35, 0.6);
      backdrop-filter: blur(5px);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &_title {
      @include mixins.fz-body($color: var(--dark-green));
      font-weight: 700;

      @media screen and (max-width: 768px) {
      }
    }

    &_content {
      position: relative;
      width: 100%;
      height: 100%;
      position: relative;
      aspect-ratio: 4 / 3;
      overflow: hidden;

      .wistia-wrapper {
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
        transition: 0.25s;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        wistia-player {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .wistia-wrapper.active {
        opacity: 1;
        pointer-events: auto;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &_content:before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) -25.08%,
        #000 125.76%
      );
      top: 0;
      left: 0;
    }

    &_timeline {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      background: rgba(0, 51, 35, 0.6);
      backdrop-filter: blur(5px);
      padding: 11px 17px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;

      .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        color: #fff;
        span {
          @include mixins.fz-body($color: #fff);
          font-weight: 700;
        }
      }

      .timeline_item {
        width: 100%;
        height: 2px;
        background: #fff;
        position: relative;

        &:before {
          content: "";
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    padding-block: 50px;
  }

  @media screen and (max-width: 768px) {
    padding-block: 40px;
  }

  @media screen and (max-width: 480px) {
    padding-block: 24px;
  }

  @media screen and (max-width: 375px) {
    padding-block: 20px;
  }
}
</style>
