<template>

    <div class="seller_page">
        <div class="seller_page_content">
            <div class="title">
                <h1> Waiting for Approval</h1>

            </div>
            <div class="message_content">
                <p>Sorry, your request is still waiting for approval by admin.</p>

            </div>
        </div>
    </div>

</template>


<script setup>


</script>



<style lang="scss" scoped>

.seller_page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &_content {
        width: 50%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 16px;
        background: #ffffff;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .title {
        width: 100%;
        height: auto;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px 20px 10px 20px;
    }

    .message_content {
        width: 70%;
        height: auto;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 30vh;
    }
}

</style>