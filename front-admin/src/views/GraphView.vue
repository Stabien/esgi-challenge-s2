<script setup>
import GraphChart from '@/components/GraphView/GraphChart.vue';
import { useRoute } from 'vue-router';
import { updateLocalStorage, findDifferentProperties } from '@/utils';
import Button from '@/components/ui/Button.vue';
// import Input from '@/components/ui/Input.vue';
import { Chart, registerables } from 'chart.js';
import { useToast } from 'vue-toastification';
import { ref, reactive, inject, onMounted, onUnmounted, provide, watch } from 'vue';

Chart.register(...registerables);
const route = useRoute();

const toast = useToast();
const { user } = inject('user');
const { socket } = inject('socket');

const userRequest = ref();
const dataGraph = ref([]);

const tagsList = ref([]);

const isSettingsModalOpened = ref(false);
const graphSettings = reactive(
  JSON.parse(localStorage.getItem('graphSettings')) || {
    appId: user.value.decodedToken.appId,
    graphValue: 'quantity', //percentages or quantity
    graphSize: 1, //size of graph: 1 to 10
    graphPeriod: 'D', //D, W, M,Y day, week, month, year
    selectedTags: '',
    event: 'click' //click, newSession, navigation
  }
);

provide('graphSettings', { graphSettings });

const openSettingModal = (isOpen) => (isSettingsModalOpened.value = isOpen);

const fetchUserRequest = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/user/${route.params.uuid}`,
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

const fetchAll = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/${JSON.stringify({
        ...graphSettings,
        appId: userRequest.value ? userRequest.value.appId : graphSettings.appId
      })}`,
      {
        method: 'GET',
        headers,
        // body: JSON.stringify(graphSettings.value),
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    // console.log(data);
    // console.log(data.map((e) => e.timestamp));
    dataGraph.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const fetchTags = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/${
        userRequest.value ? userRequest.value.uuid : user.value.decodedToken.uuid
      }`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
    tagsList.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
provide('tagsList', { tagsList });

const init = async () => {
  if (route.params.uuid) await fetchUserRequest();
  await fetchTags();
  await fetchAll();
};
watch(dataGraph, () => {
  // console.log(dataGraph);
});
watch(graphSettings, () => {
  const denyFetch = ['graphSize'];
  if (
    !denyFetch.includes(
      findDifferentProperties(
        JSON.parse(localStorage.getItem('graphSettings') || '{}'),
        graphSettings
      )
    )
  ) {
    fetchAll();
  }
  updateLocalStorage('graphSettings', JSON.stringify(graphSettings));
});

onMounted(() => {
  if (route.params.uuid) fetchUserRequest();
  init();

  socket.on('newDataAdded', () => {
    init();
  });
});

onUnmounted(() => socket.removeAllListeners('newDataAdded'));
</script>

<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 px-4 pb-4 h-screen overflow-hidden"
  >
    <div
      class="col-span-2 flex items-center justify-between dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4 h-fit"
    >
      <Button @click="console.log(userRequest)">Log</Button>

      <span> What do you want to see? </span>
      <div class="relative">
        <Button @click="openSettingModal(true)">Settings</Button>
        <ModalGraphSettings
          :fetchTags="fetchTags"
          :toggle="openSettingModal"
          v-if="isSettingsModalOpened"
        />
      </div>
    </div>
    <div class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50"></div>
    <GraphChart
      :dataGraph="dataGraph"
      class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4"
    />
  </div>
</template>
