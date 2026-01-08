<template>
  <div class="mb-4">
    <label
      v-if="label && showOuterLabel"
      :for="inputId"
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>
    
    <div
      class="flex items-center gap-2"
      :class="[
        { 'inline-flex': inline },
        wrapperClass,
      ]"
    >
      <Checkbox
        v-if="type === 'checkbox'"
        :id="inputId"
        :name="name || inputId"
        :value="value"
        :modelValue="modelValue"
        :binary="!Array.isArray(modelValue)"
        @update:modelValue="handleChange"
        :disabled="disabled"
        :class="inputClass"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <RadioButton
        v-else-if="type === 'radio'"
        :id="inputId"
        :name="name || inputId"
        :value="value"
        :modelValue="modelValue"
        @update:modelValue="handleChange"
        :disabled="disabled"
        :class="inputClass"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <div class="flex flex-col">
        <label v-if="label" class="text-sm mb-0" :for="inputId">
          {{ label }}
        </label>
        <slot name="description">
          <small v-if="description" class="text-xs text-gray-500">{{ description }}</small>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: false,
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
  type: {
    type: String,
    default: 'checkbox',
    validator: (val) => ['checkbox', 'radio'].includes(val),
  },
  label: {
    type: String,
    default: '',
  },
  description: {
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
  showOuterLabel: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  state: {
    type: String,
    default: '',
    validator: (val) => ['', 'valid', 'invalid'].includes(val),
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  wrapperClass: {
    type: [String, Array, Object],
    default: '',
  },
  inputClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus']);

const generatedId = computed(() => `generic-choice-${Math.random().toString(36).slice(2, 9)}`);
const inputId = computed(() => props.id || generatedId.value);

const handleChange = (newValue) => {
  // PrimeVue components emit the new value directly, not an event object
  
  if (props.type === 'checkbox') {
    if (Array.isArray(props.modelValue)) {
      // For array-based checkboxes, PrimeVue handles the array updates automatically
      emit('update:modelValue', newValue);
    } else {
      // For binary checkboxes, newValue is already the boolean
      // Map it to trueValue/falseValue if needed
      const finalValue = newValue ? props.trueValue : props.falseValue;
      emit('update:modelValue', finalValue);
    }
  } else {
    // For radio buttons, newValue is the selected value
    emit('update:modelValue', newValue);
  }

  // Emit change event with the new value
  emit('change', newValue);
};
</script>

<style scoped>
.generic-choice-input :deep(.form-check-input) {
  cursor: pointer;
}
</style>