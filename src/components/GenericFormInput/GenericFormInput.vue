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

    <template v-if="!isTextarea">
      <InputText
        v-if="type == 'number'"
        v-keyfilter.num
        :id="inputId"
        :name="name || inputId"
        :placeholder="placeholder"
        :class="['w-full rounded-md', customClass, type == 'number' ? '' : '']"
        :modelValue="modelValue"
        :disabled="disabled"
        :invalid="invalid"
        @input="updateValue"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <InputText
        v-else
        :id="inputId"
        :name="name || inputId"
        :type="type"
        :placeholder="placeholder"
        :class="['w-full rounded-md', customClass, type == 'number' ? '' : '']"
        :modelValue="modelValue"
        :disabled="disabled"
        :invalid="invalid"
        @input="updateValue"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
    </template>

    <Textarea
      v-else
      :id="inputId"
      :name="name || inputId"
      :placeholder="placeholder"
      :class="['w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', customClass]"
      :modelValue="modelValue"
      :rows="rows"
      :disabled="disabled"
      :invalid="invalid"
      @input="updateValue"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      autoResize
    />

    <slot name="helper" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

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
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  isTextarea: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: [String, Number],
    default: 3,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const generatedId = computed(() => `generic-input-${Math.random().toString(36).slice(2, 9)}`);
const inputId = computed(() => props.id || props.name || generatedId.value);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
.generic-form-input :deep(.form-control) {
  transition: border-color 0.2s ease;
}
</style>

