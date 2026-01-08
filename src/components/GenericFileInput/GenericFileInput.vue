<template>
  <div class="generic-form-input">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>

    <!-- Existing Image Preview (Single Only) -->
    <div v-if="showExistingImage" class="mb-3">
      <div class="relative inline-block">
        <img
          :src="existingImageUrl"
          alt="Current image"
          class="w-32 h-32 object-cover rounded border border-gray-300"
        />
        <button
          v-if="!disabled"
          type="button"
          @click="clearExistingImage"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
        >
          ×
        </button>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Current image (upload new to replace)
      </p>
    </div>

    <!-- File Upload -->
    <FileUpload
      v-show="!showExistingImage || previewUrls.length"
      mode="advanced"
      :name="name"
      :auto="true"
      :multiple="isMultiple"
      :showCancelButton="false"
      :showUploadButton="false"
      :disabled="disabled"
      :accept="accept"
      :maxFileSize="maxFileSize"
      :class="[customClass, state === 'invalid' ? 'p-invalid' : '']"
      @select="onSelect"
      @clear="onClear"
    >
      <!-- Empty Slot -->
      <template #empty>
        <div class="text-sm text-gray-500 py-4 text-center">
          {{ emptyMessage }}
        </div>
      </template>

      <!-- Preview Slot -->
      <template #content="{ files, removeFileCallback }">
        <div v-if="files.length" class="p-4 flex flex-wrap gap-4">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="relative inline-block"
          >
            <img
              :src="previewUrls[index]"
              alt="Preview"
              class="w-32 h-32 object-cover rounded border border-gray-300"
            />

            <button
              type="button"
              @click="removeFileCallback(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>

            <p class="text-sm text-gray-600 mt-1 text-center">
              {{ file.name }}
            </p>
          </div>
        </div>
      </template>
    </FileUpload>

    <!-- Error -->
    <slot name="helper">
      <p v-if="error" class="text-red-500 text-sm mt-1">
        {{ error }}
      </p>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FileUpload from 'primevue/fileupload'

const props = defineProps({
  modelValue: {
    type: [File, Array, String, null],
    default: null
  },
  label: String,
  name: String,
  id: String,
  required: Boolean,
  disabled: Boolean,
  accept: {
    type: String,
    default: 'image/*'
  },
  maxFileSize: {
    type: Number,
    default: 1000000
  },
  state: String,
  customClass: String,
  error: String,
  emptyMessage: {
    type: String,
    default: 'Drag & drop file here or click to upload'
  },
  existingImageUrl: String,
  isMultiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

const previewUrls = ref([])

const showExistingImage = computed(() => {
  return (
    !props.isMultiple &&
    props.existingImageUrl &&
    !(props.modelValue instanceof File) &&
    previewUrls.value.length === 0
  )
})

const clearPreviews = () => {
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = []
}

const onSelect = (event) => {
  const files = event.files || []

  clearPreviews()

  if (props.isMultiple) {
    previewUrls.value = files.map(file => URL.createObjectURL(file))
    emit('update:modelValue', files)
    emit('change', files)
  } else {
    const file = files[0]
    previewUrls.value = [URL.createObjectURL(file)]
    emit('update:modelValue', file)
    emit('change', file)
  }
}

const onClear = () => {
  clearPreviews()
  emit('update:modelValue', props.isMultiple ? [] : null)
  emit('change')
}

const clearExistingImage = () => {
  emit('update:modelValue', null)
  emit('change')
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      clearPreviews()
    }
  }
)
</script>

<style scoped>
.p-fileupload {
  width: 100%;
}
</style>
