<template>
  <div class="flex items-center justify-between flex-wrap gap-2 mt-6">
    <span>Showing {{ currentShownItems }} of {{ totalItems }} {{ unit }}</span>
    <Paginator
      :rows="perPage"
      :totalRecords="totalItems"
      :rowsPerPageOptions="[10, 20, 30]"
      @page="onPageChange"
      :first="(currentPage - 1) * perPage"
    />
  </div>
</template>

<script setup>
import Paginator from 'primevue/paginator';

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  currentShownItems: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 15
  },
  perPage: {
    type: Number,
    default: 15
  },
  unit: {
    type: String,
    default: 'item'
  },
});

const emit = defineEmits(['page-changed']);

const onPageChange = (event) => {
  emit('page-changed', event.page + 1);
};
</script>

<style scoped>
/* Add any custom Tailwind styles here if needed */
</style>