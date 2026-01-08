<template>
    <div class="dashboard-main-body">

        <Breadcrumb title="Users Lists" :breadcrumbs="[
            { name: 'Users List' }
        ]" />
        <div class="flex flex-col tablet:flex-row tablet:items-center gap-4 bg-white py-6 px-4 rounded-md">
            <GenericFormInput 
                v-model="filters.searchText"
                placeholder="Search By Name"
                class="grow mb-0!"
            />
            <GenericBtn 
                v-if="filters.searchText && userStore.isFiltered"
                label="Clear"
                class="px-8 order-last tablet:order-2"
                variant="outlined"
                severity="danger"
                :isLoading="userStore.isLoading"
                @click="emptySearch"
            />
            <GenericBtn 
                label="Filter"
                class="px-8"
                :isLoading="userStore.isLoading"
                :disabled="!filters.searchText"
                @click="handleFilter"
            />
        </div>
        <div class="grid grid-cols-1 tablet:grid-cols-2 web:grid-cols-3 gap-4 py-8">
            <template v-if="isLoading">
                <Card v-for="i in 9" :key="i" class="shadow-2">
                    <template #title>
                        <Skeleton width="30%" class="mb-2"></Skeleton>
                    </template>

                    <template #subtitle>
                        <Skeleton width="75%" height=".75rem" class="mb-6 bg-blue-700/50"></Skeleton>
                    </template>

                    <template #content>
                        <div class="flex flex-col gap-2 text-700">
                            <Skeleton width="60%" height="0.5rem" class="mb-2"></Skeleton>
                        </div>
                    </template>

                    <template #footer>
                        <Skeleton width="160px" height="2.2rem"></Skeleton>
                    </template>
                </Card>
            </template>
            <template v-else>
                <template v-if="filteredData?.length">
                    <Card v-for="user in filteredData" class="shadow-2">
                        <template #title>
                            <div class="text-xl font-bold text-900">
                                {{ user.name.first }} {{ user.name.last }}
                            </div>
                        </template>
    
                        <template #subtitle>
                            <div class="text-primary font-medium mb-3">
                                <a :href="`mailto:${user.email}`">
                                    {{ user.email }}
                                </a>
                            </div>
                        </template>
    
                        <template #content>
                            <div class="flex flex-col gap-2 text-700">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-map-marker"></i>
                                <span>{{ user.location.city }}, {{ user.location.country }}</span>
                            </div>
                            </div>
                        </template>
    
                        <template #footer>
                            <GenericBtn 
                                :label="'View Details'"
                                class="px-8 mt-4"
                                @click="handleDetails(user)"
                            />
                        </template>
                        
                    </Card>
                </template>
                <template v-else>
                    <Card class="shadow-2 col-span-full">    
                        <template #content>
                            <div class="flex flex-col items-center justify-center p-12 text-center bg-white">
                                <div class="mb-5 p-4 border-2 border-gray-200 rounded-full bg-gray-50 text-gray-400">
                                    <i class="pi pi-times" style="font-size: 2.5rem"></i>
                                </div>

                                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                                    No Users Found
                                </h3>
                            </div>
                        </template>
                    </Card>
                </template>
            </template>
        </div>

        <Paginator @page="handlePageChange" :rows="rowsNumber" :totalRecords="data?.length || 0"></Paginator>

        <Dialog v-model:visible="detailsModalVisible" modal header="User Data" class="w-full web:w-[60%]">
            <div class="flex flex-col md:flex-row gap-6 items-center py-4 px-2">
                <div class="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-gray-100">
                    <img
                        v-if="selectedUser?.picture?.large"
                        :src="selectedUser.picture.large"
                        :alt="`${selectedUser?.name?.first} ${selectedUser?.name?.last}`"
                        class="object-cover w-full h-full"
                    >
                    <div v-else class="flex items-center justify-center h-full text-4xl text-gray-400">?</div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="mb-3">
                        <span class="block text-sm font-semibold text-gray-500 mb-1">Full Name</span>
                        <span class="text-xl font-bold text-gray-800">
                            {{ selectedUser?.name?.first }} {{ selectedUser?.name?.last }}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                        <div>
                            <span class="block text-xs font-medium text-gray-500">Email</span>
                            <span class="text-base text-gray-700">{{ selectedUser?.email || '-' }}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-medium text-gray-500">Phone Number</span>
                            <span class="text-base text-gray-700">{{ selectedUser?.phone || '-' }}</span>
                        </div>
                        <div class="md:col-span-2">
                            <span class="block text-xs font-medium text-gray-500">Full Address</span>
                            <span class="text-base text-gray-700">
                                {{
                                    (selectedUser?.location?.street?.number
                                        ? `${selectedUser.location.street.number} `
                                        : '') +
                                    (selectedUser?.location?.street?.name || '') + 
                                    (selectedUser?.location?.city ? `, ${selectedUser.location.city}` : '') + 
                                    (selectedUser?.location?.state ? `, ${selectedUser.location.state}` : '') +
                                    (selectedUser?.location?.country ? `, ${selectedUser.location.country}` : '') + 
                                    (selectedUser?.location?.postcode ? `, ${selectedUser.location.postcode}` : '')
                                }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
import Paginator from 'primevue/paginator';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import GenericFormInput from '@/components/GenericFormInput/GenericFormInput.vue'
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue'
import Dialog from 'primevue/dialog';
import { useUserStore } from '../store.js'

const userStore = useUserStore();

const isLoading = computed(() => userStore.isLoading)
const detailsModalVisible = ref(false);
const currentPage = ref(0);
const rowsNumber = ref(12);
const selectedUser = ref({});
const initialFilters = () => {
    return {
        firstItem: 0,
        searchText: "",
        pageSize: rowsNumber.value
    }
};

const filters = ref(initialFilters());

const data = computed(() => userStore.users)
const filteredData = computed(() => {
    return data.value?.slice(filters.value.firstItem, (filters.value.firstItem + rowsNumber.value)) || []
})

onMounted(() => {
    userStore.fetchUsersData();
})


const handleFilter = () => {
    userStore.filterUsersData({ ...filters.value });
}

const emptySearch = () => {
    filters.value = initialFilters();
    userStore.filterUsersData(filters.value);
}

const handlePageChange = (val) => {
    filters.value.firstItem = val.first;
}

// Handle Edit Btn Click
const handleDetails = (val) => {
    selectedUser.value = val;
    detailsModalVisible.value = true;
}

</script>