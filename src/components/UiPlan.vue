<script setup lang="ts">
import { Task } from '@metaplex-foundation/js';
import { toRefs, watchEffect, ref } from 'vue';
import UiTask from './UiTask.vue';

const props = defineProps<{
    task: Task<any, any>,
}>()

const { task } = toRefs(props);
const children = ref<Task<any, any>[]>([]);
watchEffect(() => {
    if (!task.value) return;
    children.value = task.value.getChildren();
});
</script>

<template>
    <div class="rounded-2xl overflow-hidden space-y-0.5">
        <ui-task v-for="(child, index) in children" :key="index" :task="child"></ui-task>
    </div>
</template>
