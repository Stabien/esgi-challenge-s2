<script setup>
import { inject, ref } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps(['fetchTags']);
const { user } = inject('user');
const toast = useToast();

const tagNameInput = ref('');

const periodList = ['D', 'W', 'M', 'Y'];
const eventList = ['click', 'newSession', 'navigation'];
const graphListValue = ['DoughnutChart', 'BarChart', 'LineChart', 'PieChart', 'RadarChart'];
const { graphSettings } = inject('graphSettings');
const { tagsList } = inject('tagsList');

const setGraphPeriod = (period) => {
  graphSettings.graphPeriod = period;
};
const setGraphValue = (value) => {
  graphSettings.graphValue = value;
};
const handleSelectEvent = (event) => {
  graphSettings.event = event;
};
const handleSelectGraphList = (graph) => {
  if (graphSettings.graphList.includes(graph)) {
    graphSettings.graphList = graphSettings.graphList.filter((item) => item !== graph);
    return;
  }
  graphSettings.graphList.push(graph);
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
    if (graphSettings.selectedTags === tagsList.value.find((tag) => tag.uuid === tagUuid).name) {
      graphSettings.selectedTags = '';
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
  console.log('handle select tag');
  if (graphSettings.selectedTags === tag.name) {
    graphSettings.selectedTags = '';
    return;
  }
  graphSettings.selectedTags = tag.name;
};
</script>

<template>
  <Modal class="bg-white right-40">
    {{ graphSettings.graphSize }}
    <input type="range" min="1" max="10" v-model="graphSettings.graphSize" />
    <div class="flex justify-between">
      <div
        v-for="period in periodList"
        :key="period"
        :class="
          graphSettings.graphPeriod === period
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
        :variant="graphSettings.event === event ? 'default' : 'outline'"
        @click="handleSelectEvent(event)"
        >{{ event }}</Button
      >
    </div>
    <div class="grid grid-cols-2 gap-24 mx-auto">
      <div
        :class="
          graphSettings.graphValue === 'percentages'
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
          graphSettings.graphValue === 'quantity'
            ? 'border-palette-primary-400 text-palette-primary-400'
            : 'border-palette-gray-300 text-palette-gray-300'
        "
        @click="setGraphValue('quantity')"
      >
        100
      </div>
    </div>
    <div class="flex gap-2">
      <div
        :class="
          graphSettings.graphList.includes(graph)
            ? 'bg-palette-primary-500 hover:bg-palette-primary-700 text-soft-white'
            : 'hover:bg-palette-gray-100'
        "
        class="inline-block rounded p-2 cursor-pointer"
        :key="graph"
        v-for="graph in graphListValue"
        @click="handleSelectGraphList(graph)"
      >
        {{ graph.replace('Chart', '') }}
      </div>
    </div>
    <form
      v-if="user.status !== 'Admin'"
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
        :class="
          graphSettings.selectedTags === tag.name ? 'bg-palette-primary-100' : 'bg-soft-white'
        "
        class="text-sm rounded flex items-center justify-between relative dark:text-soft-black"
      >
        <span
          class="cursor-pointer p-1 rounded-l"
          :class="[
            graphSettings.selectedTags === tag.name
              ? 'hover:bg-palette-primary-200 '
              : 'hover:bg-palette-gray-100',
            user.status !== 'Admin' ? 'rounded-l' : 'rounded'
          ]"
          @click="handleSelectTag(tag)"
        >
          {{ tag.name }}
        </span>
        <button
          v-if="user.status !== 'Admin'"
          @click="deleteTag(tag.uuid)"
          variant="ghost"
          size="sm"
          :class="
            graphSettings.selectedTags === tag.name
              ? 'hover:bg-palette-primary-200'
              : 'hover:bg-palette-gray-100'
          "
          class="p-1 rounded-r"
        >
          X
        </button>
      </div>
    </div>
  </Modal>
</template>
