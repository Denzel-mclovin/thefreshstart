<template>
    <label class="switch">
        <input 
            type="checkbox"
            :checked="modelValue"
            @change="onChange"
        >
        <span class="slider"></span>
    </label>
</template>

<script setup lang="ts">
   const { modelValue } = defineProps<{
    modelValue: boolean
    }>()

    const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    }>()
    function onChange(e: Event) {
        emit('update:modelValue', (e.target as HTMLInputElement).checked)
    }
</script>

<style scoped>
    .switch {
    --secondary-container: var(--text-color);
    --primary: #fff;
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.7em;
    height: 1.8em;
    }

    .switch input {
    display: none;
    transition: all ease 0.3s;
    opacity: 0;
    width: 0;
    height: 0;
    }

    .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    transition: all ease 0.3s;
    transition: .2s;
    border-radius: 30px;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 1.4em;
    width: 1.4em;
    border-radius: 20px;
    left: 0.2em;
    bottom: 0.2em;
    background-color: var(--text-color);
    transition: .4s;
    }

    input:checked + .slider::before {
    background-color: var(--primary);
    transition: all ease 0.3s;

    }

    input:checked + .slider {
    background-color: var(--secondary-container);
    transition: all ease 0.3s;

    }

    input:focus + .slider {
    box-shadow: 0 0 1px var(--secondary-container);
    }

    input:checked + .slider:before {
    transform: translateX(1.9em);
    }

</style>