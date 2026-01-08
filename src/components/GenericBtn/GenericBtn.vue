<template>
    <Button
        v-bind="allAttrs"
        :type="type"
        :label="label"
        :loading="isLoading"
        :disabled="isLoading"
        class="text-md radius-8"
        :class="isLoading ? 'cursor-wait!' : ''"
    />
</template>

<script setup>
import Button from 'primevue/button';
defineProps({
    label: {
        type: String,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'submit'
    },
})
</script>
