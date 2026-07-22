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
@use '../../styles/mixins' as mixins;

.seller_page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: var(--soft-white);
    font-family: var(--font-aeonik);

    &_content {
        width: 50%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-medium);
        background: var(--white);
        box-shadow: var(--shadow-card);
    }

    .title {
        width: 100%;
        height: auto;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px 20px 10px 20px;

        h1 {
            @include mixins.fz-h3($color: var(--text-primary));
        }
    }

    .message_content {
        width: 70%;
        height: auto;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 30vh;

        p {
            @include mixins.fz-body($color: var(--text-secondary));
            text-align: center;
        }
    }
}
</style>