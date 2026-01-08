<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p class="text-gray-600 text-sm">Welcome back! Please enter your details</p>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="flex flex-col">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-envelope text-gray-400"></i>
              </div>
              <GenericFormInput
                v-model="form.email"
                type="text"
                placeholder="Email"
                customClass="w-full pl-10 pr-4 py-3"
                class="mb-2!"
                :invalid="v$.email.$error" />
            </div>
            <p v-if="v$.email.$error" class="text-red-500 text-sm mt-1">
              {{ v$.email.$errors?.[0]?.$message }}
            </p>
          </div>

          <div class="flex flex-col">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-lock text-gray-400"></i>
              </div>
              <GenericFormInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                customClass="w-full pl-10 pr-12 py-3"
                class="mb-2!"
                :invalid="v$.password.$error" />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
            <p v-if="v$.password.$error" class="text-red-500 text-sm mt-1">
              {{ v$.password.$errors?.[0]?.$message }}
            </p>
          </div>

          <GenericBtn
            :label="'Sign In'"
            :isLoading="isLoading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue';
import GenericFormInput from '@/components/GenericFormInput/GenericFormInput.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/modules/auth/store';
import { handleLogin } from '../services';
import { useRouter } from 'vue-router';
import { useAppToast } from '@/composables/useAppToast'
import { helpers, required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core'


const { showToast } = useAppToast()
const showPassword = ref(false);
const isLoading = ref(false);
const togglePassword = () => showPassword.value = !showPassword.value;

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});

const validationRules = computed(() => ({
  email: {
    required: helpers.withMessage('Email input is required', required),
    email: helpers.withMessage('Email input must has correct mail form', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
}));

const v$ = useVuelidate(validationRules, form.value)


const handleSubmit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) {
    showToast({message: 'Check login inputs validation', title: 'Error!', type: 'error' })
    return;
  }

  isLoading.value = true;
  handleLogin(form.value)
    .then((res) => {
      if(res.success){
        showToast({message: 'Login Successfully', title: 'Success!' })
        authStore.setToken(res.data.access);
        authStore.setRefreshToken(res.data.refresh);
        authStore.setUserData(res.data.userData);
        router.push('/');
      }
    })
    .catch((err) => {
      showToast({message: (err?.message || 'Something went wrong'), title: 'Error!', type: 'error' })
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>