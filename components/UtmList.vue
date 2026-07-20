<template>
  <div class="space-y-3">
    <div v-if="utmStore.utmLinksList.length === 0" class="no_available_links">
      <h2 class="text-xl font-semibold">No available links</h2>
    </div>

    <div
      v-else
      v-for="link in utmStore.utmLinksList"
      :key="link.id"
      class="border py-3 rounded flex flex-col gap-2"
    >
      <div
        class="link_head border-b border-b-gray-200 px-3 flex justify-between items-center"
      >
        <h3 class="text-lg font-semibold">Link Name: {{ link.utmName }}</h3>

        <div class="metricks_btns flex justify-end items-center gap-6">
          <div class="text-lg font-medium">Visits: {{ link.visitLink }}</div>
          <div class="text-lg font-medium">Clicks: {{ link.clickBuy }}</div>
        </div>
      </div>
      <p class="break-all text-lg px-3">{{ link.fullUrl }}</p>

      <div class="flex gap-2 px-3 w-full h-auto justify-end align-center">
        <span v-if="copiedId === link.id" class="text-green-600 text-sm pt-1">
          Copied!
        </span>
        <button
          @click="copy(link.fullUrl, link.id)"
          class="bg-green-500 text-white px-3 py-1 rounded"
        >
          Copy
        </button>

        <button
          @click="deleteLink(link.id)"
          class="bg-red-500 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUtmStore } from "../stores/utmStore";

const utmStore = useUtmStore();

const copiedId = ref(null);

const deleteLink = async (id) => {
  await utmStore.deleteUtmLink(id);
};

const copy = async (text, id) => {
  await navigator.clipboard.writeText(text);

  copiedId.value = id;

  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
};

onMounted(async () => {
  await utmStore.getUtmList();
});
</script>
