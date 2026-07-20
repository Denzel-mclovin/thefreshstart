<template>
  <div
    ref="headerRef"
    class="header"
  >
    <div class="header_container">
      <div class="header_content">

        <img
          src="/images/freshstart_logo.png"
          alt="logo"
        />

      </div>
     
    </div>
  </div>
</template>

<script setup>

// https://shop.thepillarsofwisdom.com/checkouts/cn/hWN7tonVpbDOa9dDloNf0Veb/en-mx?_r=AQABpJ7nq5P6Qh6hehgo-XLUTSYHqH0Dn0u1owxTiPAR99A&auto_redirect=false&edge_redirect=true&skip_shop_pay=true
import { ref, onMounted, onUnmounted, nextTick } from "vue";
const { getUTM } = useUTM()

const { buildUrl } = useCheckoutUrl();

const activeHeaderState = ref(false);
const activeTitleState = ref(false);
const screenHeight = ref(0);
const headerRef = ref(null);
const burgerState = ref(false);

const route = useRoute();

</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  color: black;
  background-color: var(--soft-white);
  transition: all ease 0.3s;
  z-index: 15;

  &_container {
    width: clamp(800px, 80vw, 1300px);
    height: 100%;
    margin: 0 auto;
    @media screen and (max-width: 1024px) {
      width: 95vw;
    }
  }

  &_content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    height: 100%;

    img {
      width: clamp(206px, 20vw,  250px);
      height: auto;
      max-height: 44px;
      min-height: 36px;
      object-fit: contain;
    }

    @media screen and (max-width: 768px) {
      padding: 20px 0 20px;
    }

  }

  @media screen and (max-width: 480px) {
    max-height: 65px;
  }
  @media screen and (max-width: 375px) {
    max-height: 45px;
  }
}
</style>
