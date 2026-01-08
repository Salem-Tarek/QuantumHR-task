<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>

    <Select 
      :id="inputId"
      :name="name || inputId"
      :modelValue="modelValue"
      :options="options" 
      :placeholder="selectLabel"
      optionLabel="label"
      optionValue="value"
      @update:modelValue="updateValue"
      :disabled="disabled"
      :class="['w-full', customClass, statusClass]"
    />

    <slot name="helper" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
// import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
  selectLabel: {
    type: String,
    default: 'Choose',
  },
  options: {
    type: Array,
    default: [],
  },
  state: {
    type: String,
    default: '',
    validator: (value) => ['', 'valid', 'invalid'].includes(value),
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const generatedId = computed(() => `generic-input-${Math.random().toString(36).slice(2, 9)}`);
const inputId = computed(() => props.id || props.name || generatedId.value);

const statusClass = computed(() => {
  if (props.state === 'valid') return 'is-valid';
  if (props.state === 'invalid') return 'is-invalid';
  return '';
});

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.generic-form-input :deep(.form-control) {
  transition: border-color 0.2s ease;
}
</style>

