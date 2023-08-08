<script setup>
// import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { defineProps, inject } from 'vue';
import { DoughnutChart, BarChart, ScatterChart } from 'vue-chart-3';

const { graphSettings } = inject('graphSettings');

const props = defineProps([
  'graphDataType',
  'title',
  'eventByPagesList',
  'dataType',
  'sessionByPagesList',
  'sessionByTagsList'
]);

const getClickByPage = () => {
  const clickEvents = props.eventByPagesList.filter((item) => item._id.event === props.dataType);

  const urlCounts = {};
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
const getSessionByPages = () => {
  // const clickEvents = props.eventByPagesList.filter((item) => item._id.event === props.dataType);

  const urlCounts = {};
  // Compter les occurrences de chaque URL
  props.sessionByPagesList.forEach((item) => {
    const page = item._id;
    const count = item.uniqueVisitors;

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
const getSessionByTags = () => {
  const urlCounts = {};
  // Compter les occurrences de chaque URL
  props.sessionByTagsList.forEach((item) => {
    const page = item._id;
    const count = item.uniqueVisitors;

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

const dataByDataType = () => {
  switch (props.dataType) {
    case 'click':
      return getClickByPage();
    case 'newSession':
      return getClickByPage();
    case 'sessionByPages':
      return getSessionByPages();
    case 'sessionByTags':
      return getSessionByTags();

    default:
      return getClickByPage();
  }
};

const filterDataForGraphsDonut = () => {
  const { url, occurences } = dataByDataType();
  const labels = url;
  const datasetsData = occurences;

  if (labels.length !== datasetsData.length) {
    console.log("data length doesn't match");
    return;
  }
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
    <ScatterChart
      class="w-full flex justify-center row-span-full"
      :chartData="filterDataForGraphsDonut()"
    />
  </div>
</template>
