<script setup>
import { defineProps, ref, inject, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps(['showFormTags', 'graphSettings', 'fetchTags']);
const toast = useToast();
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();

// const { props.graphSettings } = inject('props.graphSettings');
const tagNameInput = ref('');
const { tagsList } = inject('tagsList');
const { user } = inject('user');

const periodList = ['D', 'W', 'M', 'Y'];
const sizeList = ['1-3', '1-2', '2-3', 'full'];
const eventList = ['click', 'newSession', 'navigation'];
const selectedGraphValue = ['BarChart', 'DoughnutChart', 'LineChart', 'PieChart', 'RadarChart'];

const setGraphSize = (size) => {
  const updatedObject = { ...props.graphSettings, graph_size: size };
  emit('update:childObject', updatedObject);
};
const setGraphPeriod = (period) => {
  const updatedObject = { ...props.graphSettings, timeScale: period };
  emit('update:childObject', updatedObject);
};
const setGraphValue = (value) => {
  const updatedObject = { ...props.graphSettings, data_type: value };
  emit('update:childObject', updatedObject);
};
const handleSelectEvent = (event) => {
  const updatedObject = { ...props.graphSettings, event: event };
  if (event !== 'click') updatedObject.tagUuid = null;

  emit('update:childObject', updatedObject);
};
const handleSelectGraphList = (graph) => {
  const updatedObject = { ...props.graphSettings };

  if (props.graphSettings.selectedGraph === graph) {
    updatedObject.graph_type = 'BarChart';
  } else {
    updatedObject.graph_type = graph;
  }

  emit('update:childObject', updatedObject);
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
    props.fetchTags();
    tagNameInput.value = '';
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const deleteTag = async (tagUuid) => {
  try {
    if (props.graphSettings.tagUuid === tagsList.value.find((tag) => tag.uuid === tagUuid).name) {
      const updatedObject = { ...props.graphSettings, tagUuid: null };
      emit('update:childObject', updatedObject);
    }
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/tag/${tagUuid}`, {
      method: 'DELETE'
    });
    props.fetchTags();
  } catch (error) {
    console.log(error);
  }
};
const handleSelectTag = (tag) => {
  const updatedObject = { ...props.graphSettings };
  if (props.graphSettings.tagUuid === tag.uuid) {
    updatedObject.tagUuid = null;
    emit('update:childObject', updatedObject);

    return;
  }
  updatedObject.tagUuid = tag.uuid;
  updatedObject.event = 'click';

  emit('update:childObject', updatedObject);
};
</script>

<template>
  <div class="flex justify-between">
    <div
      v-for="size in sizeList"
      :key="size"
      :class="
        props.graphSettings.graph_size === size
          ? 'text-palette-primary-500 border border-palette-primary-500 '
          : 'text-palette-gray-300'
      "
      class="rounded transition-all font-bold w-8 h-8 cursor-pointer flex justify-center items-center"
      @click="setGraphSize(size)"
    >
      {{ size.replace('-', ':') }}
    </div>
  </div>
  <div class="flex justify-between">
    <div
      v-for="period in periodList"
      :key="period"
      :class="
        props.graphSettings.timeScale === period
          ? 'text-palette-primary-500 border border-palette-primary-500 '
          : 'text-palette-gray-300'
      "
      class="rounded transition-all font-bold w-8 h-8 cursor-pointer flex justify-center items-center"
      @click="setGraphPeriod(period)"
    >
      {{ period }}
    </div>
  </div>
  <div class="flex gap-2 justify-between">
    <Button
      v-for="event in eventList"
      :key="event"
      :variant="props.graphSettings.event === event ? 'default' : 'outline'"
      @click="handleSelectEvent(event)"
      >{{ event }}</Button
    >
  </div>
  <div class="grid grid-cols-2 gap-24 mx-auto">
    <div
      :class="
        props.graphSettings.data_type === 'percentages'
          ? 'border-palette-primary-400 text-palette-primary-400'
          : 'border-palette-gray-300 text-palette-gray-300'
      "
      class="border-2 font-bold w-12 h-12 flex items-center justify-center rounded cursor-pointer"
      @click="setGraphValue('percentages')"
    >
      %
    </div>
    <div
      class="border-2 font-bold w-12 h-12 flex items-center justify-center rounded cursor-pointer"
      :class="
        props.graphSettings.data_type === 'quantity'
          ? 'border-palette-primary-400 text-palette-primary-400'
          : 'border-palette-gray-300 text-palette-gray-300'
      "
      @click="setGraphValue('quantity')"
    >
      100
    </div>
  </div>
  <div class="flex gap-2 items-center">
    <div
      :class="
        props.graphSettings.graph_type === graph
          ? 'bg-palette-primary-500 hover:bg-palette-primary-700 text-soft-white'
          : 'hover:bg-palette-gray-100'
      "
      class="flex flex-col rounded p-2 cursor-pointer"
      :key="graph"
      v-for="(graph, index) in selectedGraphValue"
      @click="handleSelectGraphList(graph)"
    >
      {{ graph.replace('Chart', '') }}
      <span class="text-xs" v-if="index === 0"> default</span>
    </div>
  </div>
  <form
    v-if="user.status !== 'Admin' && props.showFormTags"
    @submit.prevent="createTag"
    class="flex gap-2 items-center"
  >
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
  <div class="flex gap-2">
    <div
      v-for="tag in tagsList"
      :key="tag"
      :class="props.graphSettings.tagUuid === tag.uuid ? 'bg-palette-primary-100' : 'bg-soft-white'"
      class="text-sm rounded flex items-center justify-between relative dark:text-soft-black"
    >
      <span
        class="cursor-pointer p-1 rounded-l"
        :class="[
          props.graphSettings.tagUuid === tag.uuid
            ? 'hover:bg-palette-primary-200 '
            : 'hover:bg-palette-gray-100',
          user.status !== 'Admin' ? 'rounded-l' : 'rounded'
        ]"
        @click="handleSelectTag(tag)"
      >
        {{ tag.name }}
      </span>
      <button
        v-if="user.status !== 'Admin' && props.showFormTags"
        @click="deleteTag(tag.uuid)"
        variant="ghost"
        size="sm"
        :class="
          props.graphSettings.tagUuid === tag.uuid
            ? 'hover:bg-palette-primary-200'
            : 'hover:bg-palette-gray-100'
        "
        class="p-1 rounded-r"
      >
        X
      </button>
    </div>
  </div>
</template>
