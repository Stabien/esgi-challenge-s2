<script setup>
import GraphChart from '@/components/GraphView/GraphChart.vue';
import GraphBarIcon from '@/components/icons/GraphBarIcon.vue';
import GraphDonutIcon from '@/components/icons/GraphDonutIcon.vue';
import GraphScatterIcon from '@/components/icons/GraphScatterIcon.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { BAR, DONUT, SCATTER } from '@/utils/graphConstant';
import { Chart, registerables } from 'chart.js';
import { useToast } from 'vue-toastification';
import { ref, inject } from 'vue';

Chart.register(...registerables);
const toast = useToast();
const { user } = inject('user');

const type = ref('');
const graphTitle = ref('');
const graphDataType = ref('');
const dataList = ref([]);

const chartTypeList = [DONUT, BAR, SCATTER];
const chartTypeIconList = [GraphDonutIcon, GraphBarIcon, GraphScatterIcon];

const fetchPossibleAnalytics = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'GET',
      headers
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/${user.value.decodedToken.appId}`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    dataList.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

fetchPossibleAnalytics();
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
    <div class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50">
      <div class="flex flex-col gap-2">
        <Button
          @click="() => (type = chartType)"
          :key="chartType"
          v-for="(chartType, index) in chartTypeList"
          :variant="type === chartType ? 'default' : 'outline'"
        >
          <component :is="chartTypeIconList[index]" height="24" width="24" />
        </Button>
      </div>
      <div class="mt-4 flex flex-col gap-2">
        <Input type="text" label="Graph title" oneLine="true" v-model="graphTitle" />

        <div class="flex flex-col w-full gap-2">
          <select v-model="graphDataType">
            <option class="dark:text-palette-gray-700" disabled value="">Please select one</option>
            <option
              class="dark:text-palette-gray-700"
              v-for="option in ['test', 'fdfg']"
              :key="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
        <Button @click="() => console.log(graphDataType.value)">test</Button>
      </div>
    </div>
    <GraphChart
      :title="graphTitle"
      :data="dataList"
      class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4"
      :type="type"
    />
  </div>
</template>
