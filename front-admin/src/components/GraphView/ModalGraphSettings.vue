<script setup>
import { inject } from 'vue';

const periodList = ['D', 'W', 'M', 'Y'];
const { graphSettings } = inject('graphSettings');

const setGraphPeriod = (period) => {
  // 86400000 //1day
  graphSettings.value.graphPeriod = period;
  const currentTime = Date.now();
  switch (period) {
    case 'D':
      graphSettings.value.graphPeriod.start = currentTime - 86400000;
      break;
    case 'W':
      graphSettings.value.graphPeriod.start = currentTime - 86400000 * 7;
      break;
    case 'M':
      graphSettings.value.graphPeriod.start = currentTime - 86400000 * 30;
      break;
    case 'Y':
      graphSettings.value.graphPeriod.start = currentTime - 86400000 * 365;
      break;

    default:
      graphSettings.value.graphPeriod.start = currentTime - 86400000 * 30; // 1 month by default
      break;
  }
  graphSettings.value.graphPeriod.end = currentTime;
};
</script>

<template>
  <Modal class="bg-white">
    <input type="range" min="1" max="10" v-model="graphSettings.graphSize" />
    <div class="flex justify-between">
      <div
        v-for="period in periodList"
        :key="period"
        :class="
          graphSettings.graphPeriod === period
            ? 'text-palette-primary-500 border border-palette-primary-500 '
            : 'text-palette-gray-300'
        "
        class="rounded transition-all font-bold w-8 h-8 cursor-pointer flex justify-center items-center"
        @click="setGraphPeriod(period)"
      >
        {{ period }}
      </div>
    </div>
  </Modal>
</template>
