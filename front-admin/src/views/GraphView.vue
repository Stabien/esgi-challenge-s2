<script setup>
import GraphChart from '@/components/GraphView/GraphChart.vue';
import { updateLocalStorage, findDifferentProperties } from '@/utils';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { Chart, registerables } from 'chart.js';
import { useToast } from 'vue-toastification';
import { ref, reactive, inject, onMounted, onUnmounted, provide, watch } from 'vue';

Chart.register(...registerables);
const toast = useToast();
const { user } = inject('user');
const { socket } = inject('socket');

const tagNameInput = ref('');
const dataGraph = ref([]);

const tagsList = ref([]);

const isSettingsModalOpened = ref(false);
const isTagsModalOpened = ref(false);
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

const openTagsModal = (isOpen) => (isTagsModalOpened.value = isOpen);
const openSettingModal = (isOpen) => (isSettingsModalOpened.value = isOpen);

const fetchAll = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/${JSON.stringify(graphSettings)}`,
      {
        method: 'GET',
        headers,
        // body: JSON.stringify(graphSettings.value),
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
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
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/${user.value.decodedToken.uuid}`,
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

const createTag = async () => {
  try {
    if (!tagNameInput.value) return;
    if (tagsList.value.map((tag) => tag.name).includes(tagNameInput.value)) {
      toast.error('Tag already exist');
      return;
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        name: tagNameInput.value
      }),
      headers,
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/${user.value.decodedToken.uuid}`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');
    fetchTags();
    tagNameInput.value = '';
    openTagsModal(false);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const deleteTag = async (tagUuid) => {
  try {
    if (graphSettings.selectedTags === tagsList.value.find((tag) => tag.uuid === tagUuid).name) {
      graphSettings.selectedTags = '';
    }
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/tag/${tagUuid}`, {
      method: 'DELETE'
    });
    fetchTags();
  } catch (error) {
    console.log(error);
  }
};
const handleSelectTag = (tag) => {
  console.log('handle select tag');
  if (graphSettings.selectedTags === tag.name) {
    graphSettings.selectedTags = '';
    return;
  }
  graphSettings.selectedTags = tag.name;
};

watch(dataGraph, () => {
  console.log(dataGraph);
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
  fetchTags();
  fetchAll();
  socket.on('newDataAdded', () => {
    fetchAll();
    fetchTags();
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
      <Button @click="openTagsModal(true)">Create tags</Button>
      <Button @click="console.log(graphSettings)">Log</Button>

      <Modal :toggle="openTagsModal" v-if="isTagsModalOpened" fullHeight="true">
        <form @submit.prevent="createTag" class="flex gap-2 items-center">
          <Input
            type="text"
            label="Create your tags"
            oneLine="true"
            v-model="tagNameInput"
            class="w-fit"
            required
          />
          <Button type="submit">Create Tags</Button>
        </form>
      </Modal>
      <span> What do you want to see? </span>
      <div class="relative">
        <Button @click="openSettingModal(true)">Settings</Button>
        <ModalGraphSettings :toggle="openSettingModal" v-if="isSettingsModalOpened" />
      </div>
      <div class="flex gap-5"></div>
    </div>
    <div class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50">
      <div class="flex flex-col gap-2 mt-2 h-[30rem] overflow-y-scroll">
        <div
          v-for="tag in tagsList"
          :key="tag"
          :class="
            graphSettings.selectedTags === tag.name ? 'bg-palette-primary-100' : 'bg-soft-white'
          "
          class="text-sm p-4 rounded"
        >
          <span @click="handleSelectTag(tag)">
            {{ tag.name || 'empty tag' }}
          </span>
          <Button @click="deleteTag(tag.uuid)">Delete</Button>
        </div>
      </div>
    </div>
    <GraphChart
      :dataGraph="dataGraph"
      class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4"
    />
  </div>
</template>
