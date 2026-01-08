<template>
    <form @submit.prevent="applyFilters" v-if="filters && filters.length">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
                v-for="f in filters"
                :key="f.key"
            >
                <slot :field="f" v-if="f.type === 'group'" :name="f.key"></slot>
                <component
                    v-else
                    :is="f.component"
                    v-model="searchParams[f.key]"
                    v-bind="f.props"
                />
            </div>
        </div>
        <div class="flex justify-end mt-4">
            <div class="w-full md:w-8/12 lg:w-9/12">
                <!-- Filter Chips -->
                <div v-if="activeFilters.length" class="mb-3 flex flex-wrap gap-2">
                    <div
                        v-for="filter in activeFilters"
                        :key="filter.key"
                        class="inline-flex items-center gap-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full"
                    >
                        <span>{{ filter.label }}: {{ filter.display }}</span>
    
                        <!-- remove one filter -->
                        <Button>
                            <i class="pi pi-times"></i>
                        </Button>
                    </div>
    
                    <!-- Clear all filters -->
                    <button
                        class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        @click="clearAllFilters"
                    >
                        Clear All
                    </button>
                </div>
            </div>
            <div class="w-full md:w-4/12 lg:w-3/12">
                <GenericBtn
                    class="w-full"
                    :label="'Filter'"
                    :isLoading="isLoading"
                />
            </div>
        </div>      
    </form>
</template>

<script setup>
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue';
import { ref, computed, onMounted } from 'vue';
const passedSearchParams = ref({});

const props = defineProps({
    filters: {
        type: Array,
        required: true
    },
    searchParams: {
        type: Object,
        required: true,
        default: () => {}
    },
    resetThePaginationTo1: {
        type: Boolean,
        default: true
    },
    callFiterAfterClearActiveFilters: {
        type: Boolean,
        default: true
    },
    isLoading: {
        type: Boolean,
        default: false
    },
})

onMounted(() => {
    passedSearchParams.value = props.searchParams;
})

const emit = defineEmits(["filter", "resetCurrentPagePagination"]);

const appliedFilters = ref({});

function buildPayload(source) {
    const payload = {};
    Object.keys(source).forEach(k => {
        if (source[k]) payload[k] = source[k];
    });
    return payload;
}

const applyFilters = () => {
    appliedFilters.value = {};

    Object.keys(passedSearchParams.value).forEach(key => {
        if (passedSearchParams.value[key] && key !== 'page') {
            appliedFilters.value[key] = passedSearchParams.value[key];
        }
    });

    passedSearchParams.value.page = 1;
    emit('filter', buildPayload(appliedFilters.value))
};

const activeFilters = computed(() => {
    return Object.keys(appliedFilters.value).map(key => {
        if(key != 'page' || key != 'per_page'){
            return {
                key,
                label: props.filters.find(f => f.key === key)?.label ?? key,
                display: getFilterDisplay(key, appliedFilters.value[key])
            };
        }
    }).filter(item => item);
});

function getFilterDisplay(key, value) {
    const filterOptions = props.filters.find(filter => filter.key == key)?.props?.options;
    return filterOptions?.find(o => o.value == value)?.label || value;
}

const removeFilter = (key) => {
    delete appliedFilters.value[key];
    passedSearchParams.value[key] = "";
    if(!Object.keys(appliedFilters.value).length || (Object.keys(appliedFilters.value).length == 1 && Object.keys(appliedFilters.value)[0] == 'page')){
        emit('resetCurrentPagePagination')
        if(props.resetThePaginationTo1){
            appliedFilters.value.page = 1;
        }
    }
    
    if(props.callFiterAfterClearActiveFilters){
        emit('filter', buildPayload(appliedFilters.value))
    }
};

const clearAllFilters = () => {
    appliedFilters.value = {};

    Object.keys(passedSearchParams.value).forEach(k => {
        if (k !== "page") passedSearchParams.value[k] = "";
    });

    if(props.callFiterAfterClearActiveFilters){
        emit('filter', { page: 1 })
    }
};

</script>