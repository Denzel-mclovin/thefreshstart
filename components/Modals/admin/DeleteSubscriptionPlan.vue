<template>

  <div class="modal">
    <div class="modal_wrapper">

        <SharedModalHead @cancelBtnMethod="modalStore.closeModal">
            Delete subscription plan
        </SharedModalHead>


        <div class="modal_content">
            <p>Are you sure you want to delete this plan?</p>
        </div>


        <div class="bottom_content">

            <SharedDefaultBtn
                class="btn-active"
                @click="deleteCurrentPlan"
            >
                Delete
            </SharedDefaultBtn>


        </div>
    </div>
  </div>

</template>

<script setup>

const modalStore = useModalStore();
const planStore = usePlanStore();

const props = defineProps({
    planId: {
        type: String,
        required: true
    }
})

const deleteCurrentPlan = async () => {

    try {

        const deletePlan = await planStore.removePlan(props.planId);

        if (deletePlan === 200) {
            alert('Plan deleted successfully');
            modalStore.closeModal();
        } 

    } catch (err) {
        alert('Something went wrong');
        console.error(err);
    }
}


</script>

<style scoped lang="scss">

.modal_wrapper{
    @media screen and (max-width: 768px) {
        & {
            height: auto !important;
        }
    }
}

.modal_content{
    text-align: center;
}

.bottom_content{
    display: flex;
    border-top: 1px solid var(--text-color);
    justify-content: flex-end;
    padding: 1em;
}



</style>
