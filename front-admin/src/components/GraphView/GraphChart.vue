<script setup>
// import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { defineProps, inject } from 'vue';
import { DoughnutChart, BarChart, LineChart, PieChart, RadarChart } from 'vue-chart-3';

const { graphSettings } = inject('graphSettings');

const props = defineProps(['dataGraph']);

const getClickByPage = () => {
  const urlCountMap = {};

  props.dataGraph.forEach((obj) => {
    if (urlCountMap[obj.url]) {
      urlCountMap[obj.url]++;
    } else {
      urlCountMap[obj.url] = 1;
    }
  });

  // Convertir urlCountMap en un tableau d'objets { url, count }
  const countArray = Object.keys(urlCountMap).map((url) => ({
    label: url,
    count: urlCountMap[url]
  }));

  return {
    labels: countArray.map((urlCount) => urlCount.label),
    occurences: countArray.map((urlCount) => urlCount.count)
  };
};
const getEventsByTimestamp = () => {
  const dataGraphClone = [...props.dataGraph];
  // Triez le tableau d'objets en fonction du timestamp
  dataGraphClone.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const dateCounts = {};

  dataGraphClone.forEach((obj) => {
    const date = new Date(obj.timestamp);
    const day = date.toISOString().split('T')[0];

    if (!dateCounts[day]) {
      dateCounts[day] = 0;
    }

    dateCounts[day]++;
  });

  const countArray = Object.keys(dateCounts).map((date) => ({
    label: date,
    count: dateCounts[date]
  }));

  return {
    labels: countArray.map((urlCount) => urlCount.label),
    occurences: countArray.map((urlCount) => urlCount.count)
  };
};
const getLabelsOccurrences = () => {
  switch (graphSettings.event) {
    case 'click':
      return getClickByPage();

    case 'newSession':
      return getEventsByTimestamp();

    default:
      return getClickByPage();
  }
};

const transformValues = (valuesList) => {
  if (graphSettings.graphValue === 'quantity') return valuesList;

  const totalSum = valuesList.reduce((sum, value) => sum + value, 0);

  // Convertissez les valeurs en pourcentages
  const percentages = valuesList.map((value) => (value / totalSum) * 100);

  return percentages;
};

const filterDataForGraphs = () => {
  const { labels, occurences } = getLabelsOccurrences();
  const datasetsData = transformValues(occurences);

  if (labels.length !== datasetsData.length) {
    console.log("data length doesn't match");
    return;
  }
  //graph donut
  return {
    labels: labels,
    datasets: [
      {
        label: `${graphSettings.event} by ${graphSettings.graphValue}`,
        data: datasetsData,

        backgroundColor: repeatArrayColors(labels.length)
      }
    ],

    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
    }
  };
};

const repeatArrayColors = (desiredLength) => {
  const colors = [
    '#FF3600',
    '#cc2b00',
    '#992000',
    '#661600',
    '#330b00',
    '#ff5e33',
    '#ff8666',
    '#ffaf99',
    '#ffd7cc'
  ];
  const originalLength = colors.length;

  if (desiredLength <= 0) {
    return [];
  }

  if (desiredLength <= originalLength) {
    // Tronquer l'array initial pour correspondre à la longueur souhaitée
    return colors.slice(0, desiredLength);
  }

  // Répéter l'array initial jusqu'à atteindre la longueur souhaitée
  const repetitions = Math.ceil(desiredLength / originalLength);
  const repeatedArray = Array.from({ length: repetitions }, () => colors).flat();

  // Tronquer l'array résultant pour correspondre à la longueur souhaitée
  return repeatedArray.slice(0, desiredLength);
};
</script>

<template>
  <div
    class="justify-center grid grid-cols-2 gap-4"
    :class="`w-[${graphSettings.graphSize.toString()}rem]`"
  >
    <DoughnutChart v-if="graphSettings.graphList.includes('DoughnutChart')" class="w-full flex justify-center" :chartData="filterDataForGraphs()" />
    <BarChart v-if="graphSettings.graphList.includes('BarChart')" class="w-full flex justify-center" :chartData="filterDataForGraphs()" />
    <PieChart v-if="graphSettings.graphList.includes('PieChart')" class="w-full flex justify-center" :chartData="filterDataForGraphs()" />
    <RadarChart v-if="graphSettings.graphList.includes('RadarChart')" class="w-full flex justify-center" :chartData="filterDataForGraphs()" />
    <LineChart v-if="graphSettings.graphList.includes('LineChart')"
      class="w-full flex justify-center row-span-full"
      :chartData="filterDataForGraphs()"
    />
  </div>
</template>
