<template>
  
  <nav class="bg-white shadow-sm h-16 flex items-center justify-between px-4 py-3">
    <h1 class="text-primary text-xl web:text-3xl font-bold">
      <routerLink to="/">
        QuantumHR Task
      </routerLink>
    </h1>
    <div class="flex items-center space-x-2">

      <RouterLink class="usersListLink px-1 tablet:px-4 py-2 text-sm font-bold rounded-md" to="/">Users List</RouterLink>
      <!-- Profile Dropdown -->
      <div class="relative">
        <button @click="toggleProfileMenu" class="flex items-center p-2 tablet:py-2 tablet:px-4 rounded-sm tablet:rounded-full bg-gray-100 hover:bg-gray-300 focus:outline-none">
          <span class="font-medium hidden tablet:inline-block!">{{ authStore.userData?.name }}</span>
          <i class="pi pi-user text-xl tablet:hidden!"></i>
        </button>



        <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a> -->
          <routerLink class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/profile">Profile</routerLink>
          <a href="javascript:;" @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store';
import { useAppToast } from '@/composables/useAppToast'

const { showToast } = useAppToast()
const isProfileMenuOpen = ref(false);
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  showToast({message: 'Logout Successfully', title: 'Success!', time: 3000 })
  router.push('/login')
};

watch(route, () => {
  isProfileMenuOpen.value = false;
}, { deep: true })
</script>

<style scoped>
  @reference "../main.css";

/* Tailwind handles most styling */
.usersListLink {
  @apply border border-primary ;
  &:hover, &.router-link-exact-active {
    @apply bg-primary text-white ;
  }
}
</style>
