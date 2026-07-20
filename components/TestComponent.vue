<template>
  <div class="test_component">
    <!-- <button class="schedule" @click="modalStore.showModal('ModalMain')">
      Schedule feature
    </button> -->

    <!-- <button class="schedule" @click="fetchProducts">
      Get products
    </button> -->

    <!-- <button class="schedule" @click="gettingTestLink">
      Get test link
    </button> -->

    <!-- <NuxtLink class="schedule" to="/admin"> Admin page </NuxtLink>

    <NuxtLink class="schedule" to="/seller"> Seller layout </NuxtLink> -->

<QuizWidget />

  </div>
</template>

<script setup>
const modalStore = useModalStore();

// const testStripe = async () => {
//   try {
//     const getInfo = await $fetch("/api/payments", {
//       method: "GET",
//     });

//     console.log(getInfo, "getInfo");
//   } catch (err) {
//     console.log(`Error updating plan: ${err}`);
//   }
// };

// const testLocation = async () => {
//   try {
//     const getInfo = await $fetch("/api/shared", {
//       method: "GET",
//       params: {
//         method: "get-location",
//       },
//     });

//     console.log(getInfo, "getInfo");
//   } catch (err) {
//     console.log(`Error updating plan: ${err}`);
//   }
// };


const fetchProducts = async () => {

  try {

    const response = await $fetch("api/skool", {
      method: "GET",
      
    })

    console.log(response, "response");

  } catch (err) {
    console.log(err)
  }


}


const gettingTestLink = async () => {

  try{

    const request = await $fetch("/api/skool", {
      method: "GET",
      params: {
        method: "test-discount-link"
      }
    })

    console.log(request, "request");

  } catch (err) {
    console.log(err)
  }
}





</script>

<style scoped lang="scss">

.test_component {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;

  

  .schedule {
    background: var(--text-color);
    color: white;
    padding: 1em 2em;
    border-radius: 10px;
  }
  

  @media screen and (max-width: 768px) {
    & {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
