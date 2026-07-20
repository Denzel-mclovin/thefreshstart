<template>
  <section class="results">
    <div class="conntainer">
      <div class="results_content">
        <div class="results_content_heading">
          <h1>Real results from real clients</h1>

          <p>
            A few of the remote professionals I've worked with, in their own
            words.
          </p>
        </div>

        <div class="results_content_media">
          <div class="column_content">
            <div class="result_media_bg" v-for="(item, idx) in columnContentLeft" :key="idx">
                <img :src="item.imgPath" alt="chat">

            </div>



          </div>
          <div class="column_content">

              <div class="result_media_bg" v-for="(item, idx) in columnContentRight" :key="idx">
                  <img :src="item.imgPath" alt="chat">

              </div>
            
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

import "swiper/css/pagination";


const columnContentLeft = ref([
  
    {
    id: 4,
    imgPath: "/images/screen4.png",
  },
    {
    id: 3,
    imgPath: "/images/screen3.png",
  },

])

const columnContentRight = ref([
   {
    id: 1,
    imgPath: "/images/screen1.png",
  },
  {
    id: 2,
    imgPath: "/images/screen2.png",
  },

    {
    id: 5,
    imgPath: "/images/screen5.png",
  },
])

</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.results {
  @include mixins.component-spacing;
  width: 100%;
  height: auto;
  position: relative;
  overflow: visible;
}

.conntainer {
  overflow: visible;
}

.results_content {
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

  .column_content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: visible;
    gap: 30px;
    flex: 1;

    @media screen and (max-width: 1024px) {
      gap: 25px;
    }

    @media screen and (max-width: 768px) {
      gap: 15px;
    }

    @media screen and (max-width: 480px) {
      gap: 20px;
    }

    @media screen and (max-width: 375px) {
      gap: 18px;
    }
  }

  .result_media_bg {
    --card-radius: 20px;
    --card-padding: 15px;

    padding: var(--card-padding);
    border: 1px solid var(--dark-green);
    border-radius: var(--card-radius);
    box-shadow: 0 4px 20px 0 rgba(0, 221, 120, 0.5);
    width: 100%;
    height: auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: calc(var(--card-radius) - var(--card-padding));
      background: #000000;
      overflow: hidden;
    }

    @media screen and (max-width: 1024px) {
      --card-radius: 20px;
      --card-padding: 10px;
    }

    @media screen and (max-width: 768px) {
      --card-radius: 16px;
      --card-padding: 8px;
    }

    @media screen and (max-width: 480px) {
      --card-radius: 12px;
      --card-padding: 8px;
    }

    @media screen and (max-width: 375px) {
      --card-radius: 10px;
      --card-padding: 5px;
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

</style>
