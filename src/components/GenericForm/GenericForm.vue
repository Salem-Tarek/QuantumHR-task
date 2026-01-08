<template>
  <Card>
    <template #content>
      <form
        ref="formRef"
        class="generic-form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div class="flex flex-wrap">
          <div
            v-for="field in fields"
            :key="field.name"
            :class="[
              'mb-5 px-2',
              field.wrapperClass,
              'w-full'
            ]"
          >
            <!-- Text Input / Textarea -->
            <GenericFormInput
              v-if="['text', 'email', 'password', 'number', 'tel', 'url', 'hidden'].includes(field.type) || field.type === 'textarea'"
              v-model="formData[field.name]"
              :label="field.label"
              :name="field.name"
              :id="field.id || field.name"
              :type="field.type === 'textarea' ? 'text' : field.type || 'text'"
              :isTextarea="field.type === 'textarea'"
              :rows="field.rows || 4"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="field.disabled || isLoading"
              :state="fieldStates[field.name]"
              :customClass="field.inputClass"
              @blur="() => touchField(field.name)"
            >
              <template #helper>
                <p v-if="fieldErrors[field.name]" :data-error="fieldErrors" class="text-red-500 text-sm mt-1">
                  {{ fieldErrors[field.name] }}
                </p>
              </template>
            </GenericFormInput>
            
            <!-- Select -->
            <GenericFormSelect
              v-if="field.type === 'select'"
              v-model="formData[field.name]"
              :label="field.label"
              :name="field.name"
              :id="field.id || field.name"
              :required="field.required"
              :disabled="field.disabled || isLoading"
              :state="fieldStates[field.name]"
              :customClass="field.inputClass"
              :options="field.options"
              @change="() => touchField(field.name)"
            >
              <template #helper>
                <p v-if="fieldErrors[field.name]" class="text-red-500 text-sm mt-1">
                  {{ fieldErrors[field.name] }}
                </p>
              </template>
            </GenericFormSelect>
      
            <!-- Date Input  -->
            <GenericDateInput
              v-if="field.type === 'date'"
              v-model="formData[field.name]"
              :label="field.label"
              :name="field.name"
              :id="field.id || field.name"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="field.disabled || isLoading"
              :state="fieldStates[field.name]"
              :customClass="field.inputClass"
              :config="field.config || {}"
              @blur="() => touchField(field.name)"
            >
              <template #helper>
                <p v-if="fieldErrors[field.name]" class="text-red-500 text-sm mt-1">
                  {{ fieldErrors[field.name] }}
                </p>
              </template>
            </GenericDateInput>
      
            <!-- Single Checkbox or Radio -->
            <GenericChoiceInput
              v-else-if="field.type === 'checkbox' && !field.options"
              v-model="formData[field.name]"
              :type="field.type"
              :value="field.value !== undefined ? field.value : true"
              :label="field.label"
              :id="field.id || field.name"
              :name="field.name"
              :disabled="field.disabled || isLoading"
              :state="fieldStates[field.name]"
              :inputClass="field.inputClass"
              :wrapperClass="field.wrapperClass"
              @change="() => { touchField(field.name); clearExternalError(field.name); }"
            />
      
            <!-- Radio Group -->
            <div v-else-if="field.type === 'radio' && field.options">
              <label v-if="field.label" class="block text-sm font-medium text-gray-700 mb-2">
                {{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span>
              </label>
              <div :class="field.optionsWrapperClass || 'flex flex-wrap gap-3'">
                <div
                  v-for="option in field.options"
                  :key="option.value"
                  :class="field.optionColClass"
                >
                  <GenericChoiceInput
                    v-model="formData[field.name]"
                    type="radio"
                    :value="option.value"
                    :label="option.label"
                    :id="`${field.name}_${option.value}`"
                    :name="field.name"
                    :disabled="field.disabled || isLoading"
                    :state="fieldStates[field.name]"
                    :inputClass="field.inputClass"
                    @change="() => { touchField(field.name); clearExternalError(field.name); }"
                  />
                </div>
              </div>
              <p v-if="fieldErrors[field.name]" class="text-red-500 text-sm mt-2">
                {{ fieldErrors[field.name] }}
              </p>
            </div>
      
            <!-- Checkbox Group (Multiple) -->
            <div v-else-if="field.type === 'checkbox' && field.options">
              <label v-if="field.label" class="block text-sm font-medium text-gray-700 mb-2">
                {{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span>
              </label>
              <div :class="field.optionsWrapperClass || 'flex flex-wrap'">
                <div
                  v-for="option in field.options"
                  :key="option.value"
                  :class="field.optionColClass"
                >
                  <GenericChoiceInput
                    v-model="formData[field.name]"
                    type="checkbox"
                    :value="option.value"
                    :label="option.label"
                    :id="`${field.name}_${option.value}`"
                    :name="field.name"
                    :disabled="field.disabled || isLoading"
                    :state="fieldStates[field.name]"
                    :inputClass="field.inputClass"
                    @change="() => { touchField(field.name); clearExternalError(field.name); }"
                  />
                </div>
              </div>
              <p v-if="fieldErrors[field.name]" class="text-red-500 text-sm mt-2">
                {{ fieldErrors[field.name] }}
              </p>
            </div>

            <!-- File Input -->
            <GenericFileInput
              v-else-if="field.type === 'file'"
              v-model="formData[field.name]"
              :label="field.label"
              :name="field.name"
              :id="field.id || field.name"
              :isMultiple="field.isMultiple"
              :required="field.required"
              :disabled="field.disabled || isLoading"
              :accept="field.accept"
              :maxFileSize="field.maxFileSize"
              :state="fieldStates[field.name]"
              :customClass="field.inputClass"
              :error="fieldErrors[field.name]"
              :emptyMessage="field.emptyMessage"
              :existingImageUrl="formData[field.name]"
              @change="() => { touchField(field.name); clearExternalError(field.name); }"
            >
              <template #helper>
                <p v-if="fieldErrors[field.name]" class="text-red-500 text-sm mt-1">
                  {{ fieldErrors[field.name] }}
                </p>
              </template>
            </GenericFileInput>

            <!-- Custom Slot Content -->
            <slot
              v-else-if="field.type === 'custom'"
              :name="`field-${field.name}`"
              :field="field"
              :value="formData[field.name]"
              :setValue="(val) => (formData[field.name] = val)"
              :formData="formData"
              :fieldState="fieldStates[field.name]"
              :fieldError="fieldErrors[field.name]"
              :touchField="() => touchField(field.name)"
              :clearError="() => clearExternalError(field.name)"
            />

          </div>
        </div>
        <slot name="externalCode"></slot>
    
        <!-- Submit Button Slot -->
        <div v-if="addSubmitBtn" :class="submitWrapperClass || 'flex items-center justify-end gap-3'">
          <slot name="actions" :isLoading="isLoading" :submit="handleSubmit">
            <GenericBtn
              :label="submitLabel || 'Submit'"
              class="px-12"
              :isLoading="isLoading"
            />
          </slot>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import GenericFormInput from '@/components/GenericFormInput/GenericFormInput.vue';
import GenericFormSelect from '@/components/GenericFormSelect/GenericFormSelect.vue';
import GenericChoiceInput from '@/components/GenericChoiceInput/GenericChoiceInput.vue';
import GenericDateInput from '@/components/GenericDateInput/GenericDateInput.vue';
import GenericBtn from '@/components/GenericBtn/GenericBtn.vue';
import { useGenericVuelidate } from '@/composables/useGenericVuelidate';
import Card from 'primevue/card';
import GenericFileInput from '@/components/GenericFileInput/GenericFileInput.vue';

const props = defineProps({
  // Form fields configuration
  fields: {
    type: Array,
    required: true,
    validator: (fields) => {
      return fields.every(
        (field) =>
          field &&
          typeof field === 'object' &&
          field.name &&
          ['text', 'email', 'password', 'number', 'tel', 'url', 'textarea', 'checkbox', 'radio', 'file', 'custom'].includes(
            field.type
          )
      );
    },
  },
  // Initial form data
  initialData: {
    type: Object,
    default: () => ({}),
  },
  // Validation rules (Vuelidate format)
  rules: {
    type: [Object, Function],
    default: () => ({}),
  },
  // Submit handler function
  onSubmit: {
    type: Function,
    required: true,
  },
  // Show Submit Btn
  getDataAsFormData: {
    type: Boolean,
    default: false,
  },
  // Show Submit Btn
  addSubmitBtn: {
    type: Boolean,
    default: true,
  },
  // Loading state
  isLoading: {
    type: Boolean,
    default: false,
  },
  // Submit button label
  submitLabel: {
    type: String,
    default: 'Submit',
  },
  // Submit button wrapper class
  submitWrapperClass: {
    type: String,
    default: 'flex items-center justify-end gap-3',
  },
  // Auto clear errors on input change
  autoClearErrors: {
    type: Boolean,
    default: true,
  },
  // Scroll to top on error
  scrollToTopOnError: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'submit', 'validation-change']);

const formRef = ref(null);

// Initialize form data from fields and initialData
const initializeFormData = () => {
  const data = {};
  props.fields.forEach((field) => {
    if (field.type === 'checkbox' && field.options) {
      // Multiple checkboxes - array
      data[field.name] = Array.isArray(props.initialData[field.name])
        ? [...props.initialData[field.name]]
        : [];
    } else if (field.type === 'checkbox' && !field.options) {
      // Single checkbox - boolean
      data[field.name] =
        props.initialData[field.name] !== undefined ? props.initialData[field.name] : false;
    } else if (field.type === 'file') {
      data[field.name] = props.initialData[field.name] || null;
    } else {
      // Other fields - string/number
      data[field.name] =
        props.initialData[field.name] !== undefined ? props.initialData[field.name] : '';
    }
  });
  return reactive(data);
};

const formData = initializeFormData();

// Get computed rules (support function for dynamic rules)
const computedRules = computed(() => {
  return typeof props.rules === 'function' ? props.rules(formData) : props.rules;
});

// Initialize validation
const {
  v$,
  fieldState,
  fieldError,
  touchField,
  resetValidation,
  setExternalErrors,
  clearExternalError,
} = useGenericVuelidate(formData, computedRules);

// Create field states object (reactive computed values)
const fieldStates = {};
props.fields.forEach((field) => {
  fieldStates[field.name] = fieldState(field.name);
});

// Create field errors object (reactive computed values)
const fieldErrors = {};
props.fields.forEach((field) => {
  fieldErrors[field.name] = fieldError(field.name);
});

// Auto clear errors on input change
if (props.autoClearErrors) {
  props.fields.forEach((field) => {
    watch(
      () => formData[field.name],
      () => {
        clearExternalError(field.name);
      },
      { deep: field.type === 'checkbox' && field.options }
    );
  });
}

// Normalize API errors
const normalizeErrors = (apiErrors) => {
  if (!apiErrors) return {};
  return Object.keys(apiErrors).reduce((acc, key) => {
    acc[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
    return acc;
  }, {});
};

// Handle form submission
const handleSubmit = async () => {
  setExternalErrors({});
  const isValid = await v$.value.$validate();
  
  emit('validation-change', isValid);
  
  if (!isValid) {
    if (props.scrollToTopOnError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  // Call onSubmit with form data
  try {
    if(props.getDataAsFormData){
      const form = new FormData();
      for(let key in formData){
        form.append(key, formData[key])
      }
      await props.onSubmit(form);
    }else{
      await props.onSubmit(formData);
    }
  } catch (error) {
    // Handle validation errors from API
    if (error?.errors || error?.response?.data?.errors) {
      const errors = error?.errors || error?.response?.data?.errors;
      setExternalErrors(normalizeErrors(errors));
      if (props.scrollToTopOnError) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    // Re-throw error so parent can handle it (show alert, etc.)
    throw error;
  }
};

// Expose form methods
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    const field = props.fields.find((f) => f.name === key);
    if (field) {
      if (field.type === 'checkbox' && field.options) {
        formData[key] = [];
      } else if (field.type === 'checkbox' && !field.options) {
        formData[key] = false;
      } else if (field.type === 'file') {
        formData[key] = null;
      } else {
        formData[key] = '';
      }
    }
  });
  resetValidation();
};

const updateFormData = (data) => {
  Object.keys(data).forEach((key) => {
    if (formData.hasOwnProperty(key)) {
      formData[key] = data[key];
    }
  });
};

const setErrors = (errors) => {
  setExternalErrors(normalizeErrors(errors));
};

// Expose public methods
defineExpose({
  formData,
  resetForm,
  updateFormData,
  setErrors,
  validate: () => v$.value.$validate(),
  resetValidation,
});

</script>

<style>
  .p-fileupload {
    border: 1px solid var(--p-select-border-color);
    padding: var(--p-select-padding-y) var(--p-select-padding-x);
    border-radius: var(--p-select-border-radius);
    width: 100%;
  }
</style>

