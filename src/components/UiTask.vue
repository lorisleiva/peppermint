<script setup lang="ts">
import { Task } from '@metaplex-foundation/js';
import { ref, toRefs, watchEffect } from 'vue';

const props = defineProps<{
    task: Task<any, any>,
}>()

const { task } = toRefs(props);
const name = ref('');
const status = ref('pending');
watchEffect(() => {
    if (!task.value) return;
    name.value = task.value.getContext<{ name: string }>().name;
    task.value.onStatusChange((taskStatus) => {
        status.value = taskStatus;
    });
})
</script>

<template>
    <div class="bg-indigo-300/10 rounded px-4 py-2 flex space-x-4">
        <div class="flex items-center justify-center text-gray-200">
            <!-- Pending. -->
            <svg v-if="status === 'pending'" class="h-7 w-7" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path class="opacity-30 text-white" d="M168,40.7a96,96,0,1,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></path>
            </svg>

            <!-- Running. -->
            <svg v-else-if="status === 'running'" class="animate-spin h-7 w-7" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path class="text-emerald-400" d="M168,40.7a96,96,0,1,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></path>
            </svg>

            <!-- Successful. -->
            <svg v-else-if="status === 'successful'" class="h-7 w-7 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <polyline points="172 104 113.3 160 84 132" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline>
                <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle>
            </svg>

            <!-- Failed. -->
            <svg v-else-if="status === 'failed'" class="h-7 w-7 text-red-400" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle>
                <line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                <line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
            </svg>

            <!-- Canceled. -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 opacity-30 text-white" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle>
                <line x1="60.1" y1="60.1" x2="195.9" y2="195.9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
            </svg>
        </div>
        <div>
            <div v-text="name"></div>
            <div v-text="status" class="text-sm text-indigo-300/60"></div>
        </div>
    </div>
</template>
