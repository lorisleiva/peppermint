<script setup lang="ts">
import { Plan, Step } from '@metaplex-foundation/js-next';
import { toRefs, watchEffect, ref } from 'vue';
import UiStep from './UiStep.vue';

const props = defineProps<{
    plan: Plan<any, any>,
}>()

const { plan } = toRefs(props);
const steps = ref<Step[]>([]);
watchEffect(() => {
    if (!plan.value) return;
    plan.value.onChange((_step, plan) => {
        steps.value = plan.getVisibleSteps();
    });
})
</script>

<template>
    <div class="rounded-2xl overflow-hidden space-y-0.5">
        <ui-step v-for="(step, index) in steps" :key="index + step.name + step.status" :step="step"></ui-step>
    </div>
</template>
