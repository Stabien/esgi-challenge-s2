<script setup>
import GraphChart from '@/components/GraphView/GraphChart.vue';
import { useRoute } from 'vue-router';
import { updateLocalStorage, findDifferentProperties } from '@/utils';
import Button from '@/components/ui/Button.vue';
// import Input from '@/components/ui/Input.vue';
import { Chart, registerables } from 'chart.js';
import { useToast } from 'vue-toastification';
import { ref, inject, onMounted, onUnmounted, provide, watch } from 'vue';

Chart.register(...registerables);
const route = useRoute();

const toast = useToast();
const { user } = inject('user');
const { socket } = inject('socket');

const userRequest = ref();
const dataGraphStart = ref();
const dataGraphEnd = ref();
const dataGraph = ref([]);
const userGraphList = ref([]);
const selectedUserGraphList = ref([]);

const handleSelectUserGraph = (graph) => {
  console.log(graph);
  if (selectedUserGraphList.value.includes(graph)) {
    selectedUserGraphList.value = selectedUserGraphList.value.filter((item) => item !== graph);
    return;
  }
  selectedUserGraphList.value.push(graph);
};
const fetchUserGraphList = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/GraphSettings/${
        route.params.uuid ? route.params.uuid : user.value.decodedToken.uuid
      }`,
      {
        method: 'GET'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
    userGraphList.value = data;
  } catch (error) {
    console.log(error);
  }
};
const tagsList = ref([]);

const isSettingsModalOpened = ref(false);
const { graphSettings } = inject('graphSettings');

const openSettingModal = (isOpen) => (isSettingsModalOpened.value = isOpen);

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
    dataGraph.value = data.analytics;
    dataGraphStart.value = data.start;
    dataGraphEnd.value = data.end;
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
    tagsList.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
provide('tagsList', { tagsList });

const init = async () => {
  await fetchUserRequest();
  await fetchUserGraphList();
  await fetchTags();
  await fetchAll();
};

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
    class="grid overflow-y-scroll grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 px-4 pb-4 h-screen"
  >
    <div
      class="col-span-2 flex items-center justify-between dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4 h-fit"
    >
      <span> What do you want to see? </span>
      <div class="relative">
        <Button @click="openSettingModal(true)">Settings</Button>
        <ModalGraphSettings
          :fetchUserGraphList="fetchUserGraphList"
          :fetchTags="fetchTags"
          :toggle="openSettingModal"
          v-if="isSettingsModalOpened"
        />
      </div>
    </div>
    <div class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50">
      <div
        :class="
          selectedUserGraphList.includes(graph)
            ? 'bg-palette-primary-500'
            : 'bg-palette-primary-100'
        "
        @click="handleSelectUserGraph(graph)"
        v-for="graph in userGraphList"
        :key="graph"
      >
        {{ graph.name }}
        {{
          new Date(graph.updatedAt)
            // .format('DD/MM/YYYY')
            .toLocaleString('en-GB', { timeZone: 'UTC' })
        }}
      </div>
    </div>
    <GraphChart
      :dataGraph="dataGraph"
      :dataGraphStart="dataGraphStart"
      :dataGraphEnd="dataGraphEnd"
      class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4"
    />
  </div>
</template>
