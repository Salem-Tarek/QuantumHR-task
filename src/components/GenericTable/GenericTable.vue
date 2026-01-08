<template>
    <div class="bg-white rounded-xl shadow-md p-0 h-full">
        <div class="p-6">
            <DataTable
                stripedRows 
                :value="isLoading ? skeletonData : data"
                removableSort
                paginator 
                :rows="10" 
            >   
                <Column v-for="col of columns" :key="col.key" :field="col.key" :header="col.label">
                    <template #body="slotProps">
                        <Skeleton v-if="isLoading" class="h-4" />
                        <slot
                            v-else
                            :name="col.key" 
                            :value="slotProps.data[col.key]" 
                            :row="slotProps.data">
                            {{ slotProps.data[col.key] || '-' }}
                        </slot>
                    </template>
                </Column>
                
                <Column v-if="showActions" header="Action" class="text-center">
                    <template #body="slotProps">
                        <Skeleton v-if="isLoading" class="h-8 w-24 mx-auto" />
                        <div v-else class="flex items-center gap-2">
                            <button 
                                v-if="showEdit"    
                                type="button"
                                class="transition w-[35px] h-[35px] bg-primary flex justify-center items-center rounded-full hover:bg-primary/80"
                                @click="$emit('edit', slotProps.data)"
                            >
                                <i class="pi pi-pencil text-md text-white"></i>
                            </button>
                            <button 
                                v-if="showDelete"
                                type="button"
                                class="transition w-[35px] h-[35px] bg-red-500 flex justify-center items-center rounded-full hover:bg-red-500/80"
                                @click="$emit('delete', slotProps.data)"
                            >
                                <i class="pi pi-trash text-md text-white"></i>
                            </button>
                            <button 
                                v-if="showDetails"
                                type="button"
                                class="transition w-[35px] h-[35px] bg-primary flex justify-center items-center rounded-full hover:bg-primary/80"
                                @click="$emit('show', slotProps.data)"
                            >
                                <i class="pi pi-eye text-md text-white"></i>
                            </button>
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center text-gray-500 py-8">
                        <i class="pi pi-inbox text-4xl mb-3 block text-gray-400"></i>
                        <p class="text-lg font-medium">No data found</p>
                        <p class="text-sm text-gray-400 mt-1">There are no records to display</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';


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
    showActions: {
        type: Boolean,
        default: false
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
    isLoading: {
        type: Boolean,
        default: false
    },
    skeletonRows: {
        type: Number,
        default: 5
    },
    pagination: {
        type: Object,
        default: () => {}
    },
});

const emit = defineEmits(['edit', 'delete', 'page-changed']);

// Create skeleton data for loading state
const skeletonData = computed(() => {
    return Array.from({ length: props.skeletonRows }, (_, index) => {
        const skeletonRow = { id: `skeleton-${index}` };
        props.columns.forEach(col => {
            skeletonRow[col.key] = '';
        });
        return skeletonRow;
    });
});

const onPageChange = (event) => {
    emit('page-changed', { page: event.page + 1, perPage: event.rows });
};
</script>

<style scoped>
/* Custom styles if needed */
</style>