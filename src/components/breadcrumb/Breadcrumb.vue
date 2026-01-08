<template>
    <div class="flex flex-wrap items-center gap-3 mb-6" :class="noTitle ? 'justify-end' : 'justify-between'">
        <h4 class="font-semibold text-xl mb-0" v-if="!noTitle">{{ title }}</h4>
        <ul class="flex items-center flex-wrap gap-2">
            <li class="font-medium">
                <router-link to="/" class="flex items-center gap-1 hover:text-blue-600">
                    <i class="pi pi-home text-lg"></i>
                    Dashboard
                </router-link>
            </li>
            <li>-</li>

            <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <li class="font-medium">
                    <template v-if="breadcrumb.link">
                        <router-link :to="breadcrumb.link" class="flex items-center gap-1 hover:text-blue-600">
                            <i class="pi pi-times text-lg" v-if="false"></i>
                            {{ breadcrumb.name }}
                        </router-link>
                    </template>
                    <template v-else>
                        {{ breadcrumb.name }}
                    </template>
                </li>
                <li v-if="index !== breadcrumbs.length - 1">-</li>
            </template>

        </ul>
    </div>
</template>

<script setup>
defineProps({
    noTitle: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
    },
    breadcrumbs: {
        type: Array,
        default: () => []
    }
})
</script>