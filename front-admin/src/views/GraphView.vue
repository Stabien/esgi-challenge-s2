<script setup>
import Button from '@/components/ui/Button.vue';
import GraphChart from '@/components/GraphView/GraphChart.vue';
import GraphBarIcon from '@/components/icons/GraphBarIcon.vue';
import GraphScatterIcon from '@/components/icons/GraphScatterIcon.vue';
import GraphDonutIcon from '@/components/icons/GraphDonutIcon.vue';
import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const type = ref('');
const chartTypeList = [DONUT, BAR, SCATTER];
const chartTypeIconList = [GraphDonutIcon, GraphBarIcon, GraphScatterIcon];
</script>

<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 px-4 pb-4 h-screen overflow-hidden"
  >
    <div
      class="col-span-2 flex items-center justify-between dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4 h-fit"
    >
      What do you want to see?
      <div class="flex gap-5">
        <Button>Pages View</Button>
        <Button>Heat map</Button>
      </div>
    </div>
    <div
      class="flex flex-col gap-2 dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md h-fit p-4"
    >
      <Button
        @click="() => (type = chartType)"
        :key="chartType"
        v-for="(chartType, index) in chartTypeList"
        :variant="type === chartType ? 'default' : 'outline'"
      >
        <component :is="chartTypeIconList[index]" height="24" width="24" />
      </Button>
    </div>
    <GraphChart class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4" :type="type" />
  </div>
</template>
