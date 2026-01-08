<template>
  <div class="dashboard-main-body">
    <Breadcrumb
      :noTitle="true"
      :breadcrumbs="[
        { name: 'Admins List', link: '/admins' },
        { name: isEdit ? formData.name : 'New Admin' },
      ]"
    />

    <GenericForm
      ref="genericFormRef"
      :fields="formFields"
      :rules="validationRules"
      :initialData="formData"
      :isLoading="isLoading"
      :submitLabel="isEdit ? 'Edit' : 'Save'"
      :onSubmit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import GenericForm from '@/components/GenericForm/GenericForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUIStore } from '@/stores/uiStore';

const uiStore = useUIStore();
const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const isLoading = ref(false);
const currentItemId = ref(null);
const genericFormRef = ref(null);

const initialFormState = () => ({
  name: '',
  email: '',
  password: '',
});

const formData = reactive(initialFormState());

const formFields = computed(() => {

  return [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Enter Name',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      placeholder: 'Enter Email',
      required: true,
    },
    ...(isEdit.value
      ? []
      : [
          {
            name: 'password',
            type: 'password',
            label: 'Password',
            placeholder: 'Enter Password',
            required: true,
          },
      ]),
  ];
});

const validationRules = computed(() => ({
  name: {
    required: helpers.withMessage('Name is required', required),
  },
  email: {
    required: helpers.withMessage('Email is required', required),
  },
  password: isEdit.value 
  ? {} 
  : 
  {
    required: helpers.withMessage('Password is required', required),
  },
}));

const normalizeErrors = (apiErrors) => {
  if (!apiErrors) return {};
  return Object.keys(apiErrors).reduce((acc, key) => {
    acc[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
    return acc;
  }, {});
};

const resetLocalForm = () => {
  Object.assign(formData, initialFormState());
  genericFormRef.value?.resetForm();
};

const handleSubmit = async (submissionData) => {
  isLoading.value = true;
  const payload = { ...submissionData };
  
};

onMounted(() => {
  currentItemId.value = route?.params?.id || null;
  if (currentItemId.value) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
});
</script>