<script setup>
import GraphChart from '@/components/GraphView/GraphChart.vue';
import GraphBarIcon from '@/components/icons/GraphBarIcon.vue';
import GraphDonutIcon from '@/components/icons/GraphDonutIcon.vue';
import GraphScatterIcon from '@/components/icons/GraphScatterIcon.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { BAR, DONUT } from '@/utils/graphConstant';
import { userStatusWebmaster } from '@/utils/userConstant';
import { Chart, registerables } from 'chart.js';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { ref, inject, watch, onMounted } from 'vue';

Chart.register(...registerables);
const toast = useToast();
const { user } = inject('user');

const router = useRouter();

const redirect = () => {
  if (user.value.status !== userStatusWebmaster) {
    router.push('/404');
    return;
  }
};
redirect();
watch(user.value, () => {
  redirect();
});
const graphTitle = ref('');
const graphDataType = ref('');
const dataType = ref('');
const eventByPagesList = ref([]);
const sessionByPagesList = ref([]);
const sessionByTagsList = ref([]);
const tagsList = ref([]);

// const chartTypeList = [DONUT, BAR, SCATTER];
const chartTypeList = [DONUT, BAR];
const chartTypeIconList = [GraphDonutIcon, GraphBarIcon, GraphScatterIcon];

const fetchEventByPages = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/eventByPages/${
        user.value.decodedToken.appId
      }`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    eventByPagesList.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
const fetchSessionByPages = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/sessionByPages/${
        user.value.decodedToken.appId
      }`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    sessionByPagesList.value = data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
const fetchSessionByTags = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/sessionByTags/${
        user.value.decodedToken.appId
      }`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
    sessionByTagsList.value = data;
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
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/all/${user.value.decodedToken.uuid}`,
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
const checkExistingValueInEvent = (evenement) => {
  return eventByPagesList.value.some((objet) => objet._id.event === evenement);
};
onMounted(() => {
  fetchEventByPages();
  fetchSessionByPages();
  fetchSessionByTags();
  fetchTags();
});

const createTag = async () => {
  if (!graphTitle.value) return;
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(graphTitle.value);
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        name: graphTitle.value
      }),
      headers: {
        headers
      },
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/add/${user.value.decodedToken.uuid}`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');
    fetchTags();
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
</script>

<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 px-4 pb-4 h-screen overflow-hidden"
  >
    <div
      class="col-span-2 flex items-center justify-between dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4 h-fit"
    >
      <!-- <form @submit.prevent="createTag" class="flex gap-2 items-center">
        <Input
          type="text"
          label="Create your tags"
          oneLine="true"
          v-model="graphTitle"
          class="w-fit"
          required
        />
        <Button type="submit" @click="createTag">Create Tags</Button>
      </form> -->
      <span> What do you want to see? </span>
      <div class="flex gap-5">
        <Button
          :variant="dataType === 'click' ? 'default' : 'outline'"
          @click="() => (dataType = 'click')"
          v-if="checkExistingValueInEvent('click')"
          >Clicks per pages</Button
        >
        <!-- <Button
          :variant="dataType === 'newSession' ? 'default' : 'outline'"
          @click="() => (dataType = 'newSession')"
          v-if="checkExistingValueInEvent('newSession')"
          >New Session</Button
        > -->
        <Button
          :variant="dataType === 'sessionByPages' ? 'default' : 'outline'"
          v-if="sessionByPagesList.length > 0"
          @click="() => (dataType = 'sessionByPages')"
          >Session by pages</Button
        >
        <Button
          :variant="dataType === 'sessionByTags' ? 'default' : 'outline'"
          v-if="sessionByTagsList.length > 0"
          @click="() => (dataType = 'sessionByTags')"
          >Clicks by tags</Button
        >
      </div>
    </div>
    <div class="rounded-md h-fit p-4 dark:bg-palette-gray-800 bg-palette-gray-50">
      <div class="flex flex-col gap-2">
        <Button
          @click="() => (graphDataType = chartType)"
          :key="chartType"
          v-for="(chartType, index) in chartTypeList"
          :variant="graphDataType === chartType ? 'default' : 'outline'"
        >
          <component :is="chartTypeIconList[index]" height="24" width="24" />
        </Button>
      </div>
      <div class="flex flex-col gap-2 mt-2 h-[30rem] overflow-y-scroll">
        <div v-for="tag in tagsList" :key="tag" class="bg-palette-primary-100 text-sm p-4 rounded">
          {{ tag.name || 'empty tag' }}
        </div>
      </div>
    </div>
    <GraphChart
      v-if="!!dataType"
      :dataType="dataType"
      class="dark:bg-palette-gray-800 bg-palette-gray-50 rounded-md p-4"
      :graphDataType="graphDataType"
      :eventByPagesList="eventByPagesList"
      :sessionByPagesList="sessionByPagesList"
      :sessionByTagsList="sessionByTagsList"
    />
  </div>
</template>
