<template>
    <div v-if="showFilter" class="bg-white rounded-xl shadow-md p-5 mb-5">
        <slot name="filters"></slot>
    </div>
    <div class="bg-white rounded-xl shadow-md p-0 h-full overflow-hidden">
        <div v-if="showBtn" class="border-b border-gray-200 bg-white py-4 px-6 flex items-center flex-wrap gap-3 justify-end">
            <GenericBtn 
                :label="btnText"
                as="router-link"
                :to="btnUrl"
            />
            <!-- <router-link v-if="showBtn" :to="btnUrl"
                class="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <i class="pi pi-plus text-lg me-2"></i>
                {{ btnText }}
            </router-link> -->
        </div>
        <GenericTable 
            :columns="columns" 
            :data="data" 
            :pagination="pagination"
            :isLoading="isLoading" 
            :showEdit="showEdit" 
            :showDelete="showDelete" 
            :showDetails="showDetails" 
            :showShownItemsNumber="showShownItemsNumber" 
            :showActions="showActions"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @show="$emit('show', $event)"
            @page-changed="$emit('page-changed', $event)"
        >
            <template
                v-for="column in columns"
                :key="column.key"
                v-slot:[column.key]="slotProps"
            >
                <slot :name="column.key" v-bind="slotProps" />
            </template>

            <template #actions="slotProps">
                <slot name="actions" v-bind="slotProps" />
            </template>
        </GenericTable>
    </div>
</template>

<script setup>
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue'
const props = defineProps({
    columns: {
        type: Array,
        required: true,
        validator: (columns) => {
            return columns.every(col => col.key && col.label)
        }
    },
    data: {
        type: Array,
        required: true,
        default: () => []
    },
    showShownItemsNumber: {
        type: Boolean,
        default: true
    },
    isLoading: {
        type: Boolean,
        default: true
    },
    showActions: {
        type: Boolean,
        default: false
    },
    showFilter: {
        type: Boolean,
        default: true
    },
    showEdit: {
        type: Boolean,
        default: true
    },
    showDelete: {
        type: Boolean,
        default: true
    },
    showDetails: {
        type: Boolean,
        default: false
    },
    showBtn: {
        type: Boolean,
        default: true
    },
    btnText: {
        type: String,
        default: "Add"
    },
    btnUrl: {
        type: String,
        default: ""
    },
    pagination: {
        type: Object,
        default: () => {}
    },
})
</script>