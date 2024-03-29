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
const dataSelectedTag = ref([]);
const { user } = inject('user');
const { socket } = inject('socket');

const props = defineProps(['graphSettings']);

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
    dataSelectedTag.value = data;
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
    occurrences: countArray.map((urlCount) => urlCount.count)
  };
};
const getPrintByPage = () => {
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
    occurrences: countArray.map((urlCount) => urlCount.count)
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
    occurrences: countArray.map((urlCount) => urlCount.count)
  };
};
const getCTRBy = () => {
  const dataGraphClone = [...dataGraph.value];
  const dataGraphClick = dataGraphClone.filter((data) => data.event === 'click');
  const dataGraphPrint = dataGraphClone.filter((data) => data.event === 'print');
  const startDate = new Date(dataGraphStart.value);
  const endDate = new Date(dataGraphEnd.value);
  const daysInRange = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

  if (props.graphSettings.data_type === 'percentages') {
    const displayCounts = {};
    const clickRatios = {};

    for (const display of dataGraphPrint) {
      const displayDate = new Date(display.timestamp).toISOString().split('T')[0];
      if (!displayCounts[displayDate]) {
        displayCounts[displayDate] = 0; // Initialize to 0
      }
      displayCounts[displayDate]++;
    }

    for (let i = 0; i < daysInRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const clickDate = currentDate.toISOString().split('T')[0];
      const displayCount = displayCounts[clickDate] || 1; // Default to 1 if no display count
      const clickOccurrences = dataGraphClick.filter(
        (click) =>
          click.timestamp.split('T')[0] === clickDate && click.directiveTag === 'CART_BUTTON'
      ).length; // Count occurrences manually
      const ratio = (clickOccurrences / displayCount) * 100;
      clickRatios[clickDate] = ratio;
    }

    const labels = Object.keys(clickRatios);
    const occurrences = Object.values(clickRatios);
    return { labels, occurrences };
  } else {
    const displayCounts = {};

    for (const display of dataGraphPrint) {
      const displayDate = new Date(display.timestamp).toISOString().split('T')[0];
      if (!displayCounts[displayDate]) {
        displayCounts[displayDate] = 0; // Initialize to 0
      }
      displayCounts[displayDate]++;
    }

    const clickCounts = {};
    const printCounts = {};

    for (let i = 0; i < daysInRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const clickDate = currentDate.toISOString().split('T')[0];

      const clickOccurrences = dataGraphClick.filter(
        (click) =>
          click.timestamp.split('T')[0] === clickDate &&
          click.directiveTag === dataSelectedTag.value[0]
      ).length; // Count occurrences manually

      const printOccurrences = dataGraphPrint.filter(
        (print) =>
          print.timestamp.split('T')[0] === clickDate &&
          print.directiveTag === dataSelectedTag.value[0]
      ).length; // Count occurrences manually

      clickCounts[clickDate] = clickOccurrences;
      printCounts[clickDate] = printOccurrences;
    }

    const dates = Object.keys(clickCounts).flatMap((date) => [date, date]);
    const occurrences = Object.values(printCounts).flatMap((print, index) => [
      print,
      clickCounts[dates[index * 2]]
    ]);
    return { labels: dates, occurrences };
  }
};
const getFunnel = () => {
  const data = [...dataGraph.value];
  const startDate = new Date(dataGraphStart.value);
  const endDate = new Date(dataGraphEnd.value);
  const daysInRange = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
  const directiveTags = dataSelectedTag.value;

  const displayCounts = {};
  for (const display of data) {
    const displayDate = new Date(display.timestamp).toISOString().split('T')[0];
    if (!displayCounts[displayDate]) {
      displayCounts[displayDate] = 0; // Initialize to 0
    }
    displayCounts[displayDate]++;
  }
  const resultArray = [];

  directiveTags.forEach((tag, directiveTagIndex) => {
    resultArray[directiveTagIndex] = {
      labels: [],
      occurrences: []
    };
    const dataByTag = data.filter((item) => item.directiveTag === tag);
    const occurrencesByTag = {};

    for (let i = 0; i < daysInRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const occurrences = dataByTag.reduce((total, entry) => {
        if (entry.timestamp.split('T')[0] === dateString) {
          return total + 1;
        }
        return total;
      }, 0);

      occurrencesByTag[dateString] = occurrences;
    }
    const sortedDates = Object.keys(occurrencesByTag).sort((a, b) => a.localeCompare(b));
    const sortedOccurrences = sortedDates.map((date) => occurrencesByTag[date]);

    resultArray[directiveTagIndex].labels = sortedDates;
    resultArray[directiveTagIndex].occurrences = sortedOccurrences;
  });

  if (props.graphSettings.data_type === 'percentages') {
    const mixedLabels = [];
    const mixedOccurrences = [];
    if (resultArray.length <= 0)
      return {
        labels: mixedLabels,
        occurrences: mixedOccurrences
      };

    for (let i = 0; i < resultArray[0].labels.length; i++) {
      const baseValue = resultArray[0].occurrences[i];

      resultArray.forEach((result, index) => {
        if (i < result.labels.length) {
          mixedLabels.push(result.labels[i]);

          if (baseValue === 0) {
            mixedOccurrences.push(0);
          } else {
            const percentage = index === 0 ? 100 : (result.occurrences[i] / baseValue) * 100;
            mixedOccurrences.push(percentage);
          }
        }
      });
    }

    return {
      labels: mixedLabels,
      occurrences: mixedOccurrences
    };
  } else {
    const mixedLabels = [];
    const mixedOccurrences = [];
    const maxLength = Math.max(...resultArray.map((result) => result.labels.length));
    for (let i = 0; i < maxLength; i++) {
      for (const result of resultArray) {
        if (i < result.labels.length) {
          mixedLabels.push(result.labels[i]);
          mixedOccurrences.push(result.occurrences[i]);
        }
      }
    }
    return { labels: mixedLabels, occurrences: mixedOccurrences };
  }
};
const getLabelsOccurrences = () => {
  switch (props.graphSettings.event) {
    case 'click':
      return getClickByPage();

    case 'newSession':
      return getEventsByTimestamp();

    case 'print':
      return getPrintByPage();
    case 'CTR':
      return getCTRBy();
    case 'funnel':
      return getFunnel();

    default:
      return getClickByPage();
  }
};

const transformValues = (valuesList) => {
  if (
    props.graphSettings.data_type === 'quantity' ||
    props.graphSettings.event === 'CTR' ||
    props.graphSettings.event === 'funnel'
  )
    return valuesList;

  const totalSum = valuesList.reduce((sum, value) => sum + value, 0);
  // Convertissez les valeurs en pourcentages
  const percentages = valuesList.map((value) => (value / totalSum) * 100);
  return percentages;
};

const filterDataForGraphs = () => {
  const { labels, occurrences } = getLabelsOccurrences();
  const datasetsData = transformValues(occurrences);

  if (labels.length !== datasetsData.length) {
    console.error("data length doesn't match");
    return;
  }
  //graph donut
  return {
    labels: labels,
    datasets: [
      {
        label: `${props.graphSettings.name}, from ${new Date(
          dataGraphStart.value
        ).toDateString()} to ${new Date(dataGraphEnd.value).toDateString()} ${
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
