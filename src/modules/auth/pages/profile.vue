<template>
    <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow mt-8">
        <h2 class="text-xl font-bold mb-6">Profile Info</h2>
        <form @submit.prevent="onSubmit">
            <GenericFormInput
                label="Name"
                v-model="form.name"
                :disabled="!isEditing || isLoading"
                class="mb-4"
                required
                :invalid="v$.name.$error"
            >
                <template #helper>
                    <p v-if="v$.name.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.name.$errors[0]?.$message }}
                    </p>
                </template>
            </GenericFormInput>
            <GenericFormInput
                label="Phone"
                v-model="form.phone"
                :disabled="!isEditing || isLoading"
                class="mb-4"
                required
                :invalid="v$.phone.$error"
            >
                <template #helper>
                    <p v-if="v$.phone.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.phone.$errors[0]?.$message }}
                    </p>
                </template>
            </GenericFormInput>
            <GenericFormInput
                label="Job Title"
                v-model="form.jobTitle"
                :disabled="!isEditing || isLoading"
                class="mb-4"
                required
                :invalid="v$.jobTitle.$error"
            >
                <template #helper>
                    <p v-if="v$.jobTitle.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.jobTitle.$errors[0]?.$message }}
                    </p>
                </template>
            </GenericFormInput>
            <GenericFormInput
                label="Years of Experience"
                v-model="form.yearsOfExperience"
                type="number"
                min="0"
                :disabled="!isEditing || isLoading"
                class="mb-4"
                required
                :invalid="v$.yearsOfExperience.$error"
            >
                <template #helper>
                    <p v-if="v$.yearsOfExperience.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.yearsOfExperience.$errors[0]?.$message }}
                    </p>
                </template>
            </GenericFormInput>
            <GenericFormInput
                label="Address"
                v-model="form.address"
                :disabled="!isEditing || isLoading"
                class="mb-4"
                required
                :invalid="v$.address.$error"
            >
                <template #helper>
                    <p v-if="v$.address.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.address.$errors[0]?.$message }}
                    </p>
                </template>
            </GenericFormInput>

            <div class="mb-4">
                <label
                    class="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Working Hours
                    <span class="text-red-600">*</span>
                </label>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col">
                    <DatePicker showIcon iconDisplay="input" :showClear="!(!isEditing || isLoading)" :disabled="!isEditing || isLoading" :invalid="v$.workingHoursFrom.$error || workingHoursError" v-model="form.workingHoursFrom" placeholder="Date From" timeOnly fluid>
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                    <p v-if="v$.workingHoursFrom.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.workingHoursFrom.$errors[0]?.$message }}
                    </p>
                </div>
                <div class="flex flex-col">
                    <DatePicker showIcon iconDisplay="input" :showClear="!(!isEditing || isLoading)" :disabled="!isEditing || isLoading" :invalid="v$.workingHoursTo.$error || workingHoursError" v-model="form.workingHoursTo" placeholder="Date To" timeOnly fluid>
                        <template #inputicon="slotProps">
                            <i class="pi pi-clock" @click="slotProps.clickCallback" />
                        </template>
                    </DatePicker>
                    <p v-if="v$.workingHoursTo.$error" class="text-red-500 text-sm mt-1">
                        {{ v$.workingHoursTo.$errors[0]?.$message }}
                    </p>
                </div>
                <p v-if="workingHoursError" class="col-span-2 text-red-500 text-sm mt-1">
                    Working Hours To Must Be greater than Working Hours From
                </p>
            </div>

            <div class="flex gap-3 justify-end mt-8">
                <GenericBtn
                    v-if="!isEditing"
                    class="px-10"
                    type="button"
                    label="Edit"
                    @click="isEditing = true"
                />
                <GenericBtn
                    v-if="isEditing"
                    class="px-10"
                    type="submit"
                    label="Save"
                    :isLoading="isLoading"
                />
                <GenericBtn
                    v-if="isEditing"
                    type="button"
                    label="Cancel"
                    variant="outlined"
                    severity="danger"
                    class="px-8"
                    @click="onCancel"
                />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue'
import GenericFormInput from '@/components/GenericFormInput/GenericFormInput.vue'
import { useAuthStore } from '@/modules/auth/store'
import DatePicker from 'primevue/datepicker';
import { useAppToast } from '@/composables/useAppToast'
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core'
import dayjs from 'dayjs';

const { showToast } = useAppToast()
const authStore = useAuthStore()
const isEditing = ref(false)
const isLoading = ref(false)
const workingHoursError = ref(false)


let form = ref({
    name: authStore.userData?.name || '',
    phone: authStore.userData?.phone || '',
    jobTitle: authStore.userData?.jobTitle || '',
    yearsOfExperience: authStore.userData?.yearsOfExperience || '',
    address: authStore.userData?.address || '',
    workingHoursFrom: authStore.userData?.workingHoursFrom || new Date(),
    workingHoursTo: authStore.userData?.workingHoursTo || new Date(),
})


const validationRules = computed(() => ({
  name: {
    required: helpers.withMessage('Name is required', required),
  },
  phone: {
    required: helpers.withMessage('phone is required', required),
  },
  jobTitle: {
    required: helpers.withMessage('job Title is required', required),
  },
  yearsOfExperience: {
    required: helpers.withMessage('Years Of Experience is required', required),
  },
  address: {
    required: helpers.withMessage('Address is required', required),
  },
  workingHoursFrom: {
    required: helpers.withMessage('Working Hours From is required', required),
  },
  workingHoursTo: {
    required: helpers.withMessage('Working Hours To is required', required),
  },
}));

const v$ = useVuelidate(validationRules, form.value)


const originalData = ref({ ...form.value })

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (!valid) {
        showToast({message: 'Check all inputs Validation', title: 'Error!', type: 'error' })
        return
    }

    const workingFrom = dayjs(form.value.workingHoursFrom);
    const workingTo = dayjs(form.value.workingHoursTo);
    if(workingTo.diff(workingFrom) <= 0){
        workingHoursError.value= true;
        return;
    }else{
        workingHoursError.value= false;
    }
    

    isLoading.value = true;
    setTimeout(() => {
        try {
            authStore.setUserData({ ...form.value })
            originalData.value = { ...form.value }
            isEditing.value = false
            showToast({message: 'Profile updated Successfully', title: 'Updated!' })
        } catch (e) {
            showToast({message: (err?.message || 'Failed to update profile'), title: 'Error!', type: 'error' })
        } finally {
            isLoading.value = false
        }
    }, 1000)
}

const onCancel = () => {
    form.value = { ...originalData.value }
    isEditing.value = false
}
</script>