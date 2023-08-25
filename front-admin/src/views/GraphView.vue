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
const userGraphList = ref([]);
const selectedUserGraphList = ref([]);
const tagsList = ref([]);
const isSettingsModalOpened = ref(false);
const { graphSettings } = inject('graphSettings');

const updateSelectedGraph = (newSelectedGraph) => {
  selectedUserGraphList.value = newSelectedGraph;
};

const handleSelectUserGraph = (graph) => {
  if (selectedUserGraphList.value.some((selectedGraph) => selectedGraph.uuid === graph.uuid)) {
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
    userGraphList.value = [...data.filter((item) => !userGraphList.value.includes(item))];
    updateSelectedGraph([]);
    // [...new Set(firstArray.concat(secondArray))]
  } catch (error) {
    console.log(error);
  }
};

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
    // fetchAll();
  }
  updateLocalStorage('graphSettings', JSON.stringify(graphSettings));
});

onMounted(() => {
  fetchUserRequest();
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
    <div
      class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50 flex flex-col gap-4"
    >
      <GraphListItem
        @update:childSelectedGraph="updateSelectedGraph"
        :fetchGraphs="fetchUserGraphList"
        :handleSelectUserGraph="handleSelectUserGraph"
        :selectedUserGraphList="selectedUserGraphList"
        :graph="graph"
        v-for="graph in userGraphList"
        :key="graph"
      />
    </div>
    <div class="grid grid-cols-12 gap-4 h-min">
      <GraphChart v-for="graph in selectedUserGraphList" :key="graph" :graphSettings="graph" />
    </div>
  </div>
</template>
