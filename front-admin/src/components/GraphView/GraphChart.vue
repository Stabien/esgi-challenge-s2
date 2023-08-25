<script setup>
// import { DONUT, BAR, SCATTER } from '@/utils/graphConstant';
import { defineProps, inject, ref, onMounted, onUnmounted } from 'vue';
import { DoughnutChart, BarChart, LineChart, PieChart, RadarChart } from 'vue-chart-3';
import { useRoute } from 'vue-router';

const route = useRoute();
const userRequest = ref();
const dataGraph = ref([]);
const dataGraphStart = ref();
const dataGraphEnd = ref();
const dataSelectedTag = ref();
const { user } = inject('user');
const { socket } = inject('socket');

const props = defineProps(['graphSettings']);

const fetchSelectedTag = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/tagUuid/${props.graphSettings.tagUuid}`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    dataSelectedTag.value = data.name;
  } catch (error) {
    console.log(error);
  }
};

const handleSize = () => {
  switch (props.graphSettings.graph_size) {
    case '1-3':
      return 'col-span-4';
    case '2-3':
      return 'col-span-8';
    case '1-2':
      return 'col-span-6';

    default:
      return 'col-span-full';
  }
};
const fetchAll = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/${JSON.stringify({
        ...props.graphSettings,
        selectedTags: dataSelectedTag.value,
        appId: userRequest.value.appId
      })}`,
      {
        method: 'GET',
        headers,
        // body: JSON.stringify(props.graphSettings.value),
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    dataGraph.value = data.analytics;
    dataGraphStart.value = data.start;
    dataGraphEnd.value = data.end;
  } catch (error) {
    console.log(error);
    // toast.error(error.message);
  }
};
const getClickByPage = () => {
  const urlCountMap = {};

  dataGraph.value.forEach((obj) => {
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
  const dataGraphClone = [...dataGraph.value];
  const startDate = new Date(dataGraphStart.value);
  const endDate = new Date(dataGraphEnd.value);
  const daysInRange = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
  const dateCounts = {};

  // Triez le tableau d'objets en fonction du timestamp
  dataGraphClone.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  for (let i = 0; i < daysInRange; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    dateCounts[currentDate.toISOString().split('T')[0]] = 0;
  }

  for (const entry of dataGraphClone) {
    const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
    if (entryDate in dateCounts) {
      dateCounts[entryDate]++;
    }
  }

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
  switch (props.graphSettings.event) {
    case 'click':
      return getClickByPage();

    case 'newSession':
      return getEventsByTimestamp();

    default:
      return getClickByPage();
  }
};
const fetchUserRequest = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/user/${
        route.params.uuid ? route.params.uuid : user.value.decodedToken.uuid
      }`,
      {
        method: 'GET',
        headers
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    userRequest.value = data;
  } catch (error) {
    console.log(error);
  }
};

const transformValues = (valuesList) => {
  if (props.graphSettings.data_type === 'quantity') return valuesList;

  const totalSum = valuesList.reduce((sum, value) => sum + value, 0);

  // Convertissez les valeurs en pourcentages
  const percentages = valuesList.map((value) => (value / totalSum) * 100);

  return percentages;
};

const filterDataForGraphs = () => {
  const { labels, occurences } = getLabelsOccurrences();
  const datasetsData = transformValues(occurences);

  if (labels.length !== datasetsData.length) {
    console.error("data length doesn't match");
    return;
  }
  //graph donut
  return {
    labels: labels,
    datasets: [
      {
        label: `${props.graphSettings.name} ${
          dataSelectedTag.value ? `(tag :${dataSelectedTag.value})` : ''
        } `,
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

const init = async () => {
  await fetchUserRequest();
  if (props.graphSettings.tagUuid) await fetchSelectedTag();
  await fetchAll();
};
onMounted(() => {
  init();

  socket.on('newDataAdded', () => {
    init();
  });
});

onUnmounted(() => socket.removeAllListeners('newDataAdded'));
</script>

<template>
  <div class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4" :class="handleSize()">
    <DoughnutChart
      v-if="props.graphSettings.graph_type === 'DoughnutChart'"
      :chartData="filterDataForGraphs()"
    />
    <BarChart
      v-if="props.graphSettings.graph_type === 'BarChart'"
      :chartData="filterDataForGraphs()"
    />
    <PieChart
      v-if="props.graphSettings.graph_type === 'PieChart'"
      :chartData="filterDataForGraphs()"
    />
    <RadarChart
      v-if="props.graphSettings.graph_type === 'RadarChart'"
      :chartData="filterDataForGraphs()"
    />
    <LineChart
      v-if="props.graphSettings.graph_type === 'LineChart'"
      :chartData="filterDataForGraphs()"
    />
  </div>
</template>
