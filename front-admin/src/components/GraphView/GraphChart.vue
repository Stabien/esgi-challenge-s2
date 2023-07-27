<script setup>
import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { defineProps } from 'vue';
import { DoughnutChart, BarChart, ScatterChart } from 'vue-chart-3';
import { inject, watch } from 'vue';
import { userStatusWebmaster } from '@/utils/userConstant';
import { useRouter } from 'vue-router';

// Handle redirection
const { user } = inject('user');
const router = useRouter();
const redirect = () => {
  if (user.value.status !== userStatusWebmaster) router.push('/404');
};
redirect();
watch(user.value, () => {
  redirect();
});

const props = defineProps(['type', 'title', 'data', 'dataType']);

const getClickByPage = () => {
  const clickEvents = props.data.filter((item) => item._id.event === props.dataType);

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

const filterDataForGraphsDonut = () => {
  const { url, occurences } = getClickByPage();
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
        label: props.title || 'Beautiful Graph',
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
  <div class="flex justify-center">
    <DoughnutChart
      v-if="props.type === DONUT"
      class="w-full flex justify-center"
      :chartData="filterDataForGraphsDonut()"
    />
    <ScatterChart
      v-if="props.type === SCATTER"
      class="w-full flex justify-center"
      :chartData="filterDataForGraphsDonut()"
    />
    <BarChart
      v-if="props.type === BAR"
      class="w-full flex justify-center"
      :chartData="filterDataForGraphsDonut()"
    />
  </div>
</template>
