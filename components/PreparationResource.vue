<template>
  <section class="resource">
    <div class="conntainer">
      <div class="resource_content">
        <div class="resource_heading">
          <h1>Preparation Resources</h1>

          <p>Essential viewing to maximize our time together.</p>
        </div>

        <div class="resource_media">

          <VideoComponent
            v-for="id in mediaIds"
            :key="id"
            :src="`https://fast.wistia.com/embed/${id}.js`"
            :media-id="id"
          />
        </div>
      
      
      </div>
    </div>
  </section>
</template>



<script setup>


const mediaIds = [
  "n50p98a6i8",
  "dlak7c96na",
  "j10675jsbn",
  "hxwgyl9egw",
  "0ajj9fkr2v",
  "xoqyv0jymi",
  "96yg4qdh2n",
];


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
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-start;
    position: relative;
    width: 100%;
    height: auto;
    gap: 20px;

    @media screen and (max-width: 648px) {
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

    &_play.is_loading {
      opacity: 0.5;
      cursor: progress;
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
      border-radius: 12px;

      .wistia-wrapper {
        opacity: 1;
        pointer-events: none;
        position: relative;
        width: 100%;
        height: 100%;
      }
      .wistia-wrapper.active {
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
      border-radius: 12px;
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
