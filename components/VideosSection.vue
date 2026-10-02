<template>
  <section class="videos">
    <div class="conntainer">
      <div class="videos_content">
        <div class="results_content_heading">
          <h1>Still on the fence?</h1>
        </div>

        <div class="results_content_media">
          <!-- TODO: CHECK WHY VIDEO HAVE EXTRA CONTROLS AND PAUSED AT START -->
          <VideoComponent src="https://fast.wistia.com/embed/k304wo40mb.js" media-id="k304wo40mb"/>
          <VideoComponent src="https://fast.wistia.com/embed/qbvrmw3gai.js" media-id="qbvrmw3gai"/>
          <VideoComponent src="https://fast.wistia.com/embed/dzemku09rm.js" media-id="dzemku09rm"/>
          <VideoComponent src="https://fast.wistia.com/embed/clnjuxo4ol.js" media-id="clnjuxo4ol"/>
          <VideoComponent src="https://fast.wistia.com/embed/rkoa61a5lu.js" media-id="rkoa61a5lu"/>
          <VideoComponent src="https://fast.wistia.com/embed/kdzatkr3eo.js" media-id="kdzatkr3eo"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.videos {
  @include mixins.component-spacing;
  width: 100%;
  height: auto;
  position: relative;
  overflow: visible;
}

.conntainer {
  overflow: visible;
}

.videos_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 50px;

  &_heading {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  h1 {
    @include mixins.fz-h1(
      $color: var(--dark-green),
      $size: clamp(1.75rem, 5vw, 3rem)
    );
  }

  p {
    @include mixins.fz-body($color: var(--dark-green));
  }

  &_media {
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row-reverse;
    transform: translateY(-10px);
    width: 75%;
    height: auto;
    gap: 30px;

    @media screen and (max-width: 1024px) {
      gap: 25px;
    }

    @media screen and (max-width: 768px) {
      gap: 15px;
    }

    @media screen and (max-width: 480px) {
      flex-direction: column;
      justify-content: flex-start;
      width: 100%;
      gap: 28px;
    }

    @media screen and (max-width: 375px) {
      gap: 24px;
    }
  }

  @media screen and (max-width: 1024px) {
    gap: 40px;
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

/* Wistia loading placeholders */
wistia-player[media-id='k304wo40mb']:not(:defined),
wistia-player[media-id='qbvrmw3gai']:not(:defined),
wistia-player[media-id='dzemku09rm']:not(:defined),
wistia-player[media-id='clnjuxo4ol']:not(:defined),
wistia-player[media-id='rkoa61a5lu']:not(:defined),
wistia-player[media-id='kdzatkr3eo']:not(:defined) {
  display: block;
  filter: blur(5px);
  padding-top: 56.25%;
}

wistia-player[media-id='k304wo40mb']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/k304wo40mb/swatch');
}

wistia-player[media-id='qbvrmw3gai']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/qbvrmw3gai/swatch');
}

wistia-player[media-id='dzemku09rm']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/dzemku09rm/swatch');
}

wistia-player[media-id='clnjuxo4ol']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/clnjuxo4ol/swatch');
}

wistia-player[media-id='rkoa61a5lu']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/rkoa61a5lu/swatch');
}

wistia-player[media-id='kdzatkr3eo']:not(:defined) {
  background: center / contain no-repeat
    url('https://fast.wistia.com/embed/medias/kdzatkr3eo/swatch');
}
</style>