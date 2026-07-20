<template>
    <button class="button" @click.stop>
        <slot></slot>
    </button>
</template>

<script setup>
</script>

<style scoped>
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    min-width: 120px;
    padding-inline: 10px;
    border-radius: 10px;
    background: #ecf0f3;
    font-size: 16px;
    font-weight: bold;
    color: #394a56;
    cursor: pointer;
    border: none;
    box-shadow: -8px -4px 8px 0px #ffffff,
                8px 4px 12px 0px #d1d9e6;
    transition: all 0.2s ease-in-out;
}

.button:active {
    box-shadow: 4px 4px 4px 0px #d1d9e6 inset,
                -4px -4px 4px 0px #ffffff inset;
}
</style>