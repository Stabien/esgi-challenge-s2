<script setup>
// import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { defineProps, inject } from 'vue';
import { DoughnutChart, BarChart, LineChart } from 'vue-chart-3';

const { graphSettings } = inject('graphSettings');

const props = defineProps(['dataGraph']);

const getClickByPage = () => {
  const clickEvents = props.dataGraph;
  const urlCounts = {};
  if (!clickEvents || clickEvents.length <= 0) return { url: 0, occurences: 0 };
  // Compter les occurrences de chaque URL
  clickEvents.forEach((item) => {
    const { page } = item._id;
    const count = item.count;

    if (!urlCounts[page]) {
      urlCounts[page] = count;
    } else {
      urlCounts[page] += count;
    }
  });
  // Extraire les URLs et les occurrences
  const urlsArray = Object.keys(urlCounts);
  const occurrencesArray = Object.values(urlCounts);
  return { url: urlsArray, occurences: occurrencesArray };
};

const filterDataForGraphsDonut = () => {
  const { url, occurences } = getClickByPage();
  const labels = url;
  const datasetsData = occurences;

  if (labels.length !== datasetsData.length) {
    console.log("data length doesn't match");
    return;
  }
  //graph donut
  return {
    labels: labels,
    datasets: [
      {
        label: props.title || props.dataType,
        data: datasetsData,

        backgroundColor: repeatArrayColors(labels.length)
      }
    ]
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
    <DoughnutChart class="w-full flex justify-center" :chartData="filterDataForGraphsDonut()" />
    <BarChart class="w-full flex justify-center" :chartData="filterDataForGraphsDonut()" />
    <LineChart
      class="w-full flex justify-center row-span-full"
      :chartData="filterDataForGraphsDonut()"
    />
  </div>
</template>
