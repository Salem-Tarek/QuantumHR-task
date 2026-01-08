<template>
  <div class="generic-form-input generic-date-input">
    <label
      v-if="label"
      :for="inputId"
      class="form-label fw-semibold text-primary-light text-sm mb-8"
    >
      {{ label }}
      <span v-if="required" class="text-danger-600">*</span>
    </label>
    
    <div class="position-relative">
      <input 
        :id="inputId"
        :name="name || inputId"
        class="form-control radius-8 bg-base"
        ref="inputEl"
        type="text"
        :placeholder="placeholder || 'dd-mm-yyyy'"
        :class="[statusClass, customClass]"
        :value="modelValue"
        :disabled="disabled"
        @input="updateValue"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      
      <span class="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
        <i class="pi pi-calendar text-lg"></i>
      </span>
    </div>
    
    <slot name="helper" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  name: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  customClass: [String, Array, Object],
  state: {
    type: String,
    default: "",
    validator: (value) => ["", "valid", "invalid"].includes(value),
  },
  
  /** pass custom flatpickr config from parent if needed */
  config: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

const inputEl = ref(null);
let fp = null;

// Generate ID
const generatedId = computed(() => `generic-input-${Math.random().toString(36).slice(2, 9)}`);
const inputId = computed(() => props.id || props.name || generatedId.value);

// Validation classes
const statusClass = computed(() => {
  if (props.state === "valid") return "is-valid";
  if (props.state === "invalid") return "is-invalid";
  return "";
});

// v-model handler
const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};

// Initialize flatpickr
const initializeFlatpickr = () => {
  if (fp) {
    fp.destroy();
  }
  
  fp = flatpickr(inputEl.value, {
    dateFormat: "d-m-Y",
    allowInput: true,
    onChange: (selectedDates, dateStr) => {
      emit("update:modelValue", dateStr);
    },
    // merge with custom config
    ...props.config,
  });
  
  // set initial value
  if (props.modelValue) {
    fp.setDate(props.modelValue);
  }
};

// Mount flatpickr
onMounted(() => {
  initializeFlatpickr();
});

// Watch for config changes and reinitialize
watch(() => props.config, (newConfig, oldConfig) => {
  // Check if config actually changed
  if (JSON.stringify(newConfig) !== JSON.stringify(oldConfig)) {
    initializeFlatpickr();
  }
}, { deep: true });

// Watch for modelValue changes from parent
watch(() => props.modelValue, (newValue) => {
  if (fp && newValue) {
    fp.setDate(newValue);
  }
});

// destroy on unmount
onBeforeUnmount(() => {
  if (fp) fp.destroy();
});
</script>

<style scoped>
.generic-form-input :deep(.form-control) {
  transition: border-color 0.2s ease;
}
</style>