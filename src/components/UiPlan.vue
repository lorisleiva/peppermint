<script setup lang="ts">
import { Plan } from '@metaplex-foundation/js-next';
import { toRefs, watchEffect, ref } from 'vue';
import UiStep from './UiStep.vue';

const props = defineProps<{
    plan: Plan<any, any>,
}>()

const { plan } = toRefs(props);
const steps = ref<Plan<any, any>['steps']>([]);
watchEffect(() => {
    if (!plan.value) return;
    plan.value.onChange(() => {
        steps.value = plan.value.getVisibleSteps();
    });
})
</script>

<template>
    <div class="rounded-2xl overflow-hidden space-y-0.5">
        <ui-step v-for="(step, index) in steps" :key="index + step.name + step.status" :step="step"></ui-step>
    </div>
</template>
