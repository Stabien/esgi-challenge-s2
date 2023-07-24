<script setup>
import { req3 } from '@/utils/constant';
import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';

import { defineProps } from 'vue';
import { DoughnutChart, BarChart, ScatterChart } from 'vue-chart-3';

const props = defineProps(['type']);

console.log(props.type);
const testData = {
  labels: [
    'visitePage1',
    'visitePage2',
    'visitePage3',
    'visitePage4',
    'visitePage1',
    'visitePage2',
    'visitePage3',
    'visitePage4'
  ],
  datasets: [
    {
      label: 'test',
      data: [
        req3.visitePage1,
        req3.visitePage2,
        req3.visitePage3,
        req3.visitePage4,
        req3.visitePage1,
        req3.visitePage2,
        req3.visitePage3,
        req3.visitePage4
      ],
      backgroundColor: [
        '#FF3600',
        '#ff5e33',
        '#ff8666',
        '#ffaf99',
        '#ffd7cc',
        '#330b00',
        '#661600',
        '#992000',
        '#cc2b00'
      ]
    }
  ]
};
</script>

<template>
  <div class="flex justify-center">
    <DoughnutChart
      v-if="props.type === DONUT"
      class="w-full flex justify-center"
      :chartData="testData"
    />
    <ScatterChart
      v-if="props.type === SCATTER"
      class="w-full flex justify-center"
      :chartData="testData"
    />
    <BarChart v-if="props.type === BAR" class="w-full flex justify-center" :chartData="testData" />
  </div>
</template>
