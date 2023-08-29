<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
const toast = useToast();
const props = defineProps([
  'graph',
  'fetchGraphs',
  'selectedUserGraphList',
  'handleSelectUserGraph'
]);
const isModalOpen = ref(false);
const graphClone = ref(props.graph);

const openModal = (isOpen) => (isModalOpen.value = isOpen);
const closeModal = () => {
  cancelChanges();
  isModalOpen.value = false;
};

const updateParentObject = (newObject) => {
  graphClone.value = newObject;
};

const cancelChanges = () => (graphClone.value = props.graph);

const isSame = () => {
  const keys1 = Object.keys(graphClone.value);
  const keys2 = Object.keys(props.graph);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (graphClone.value[key] !== props.graph[key]) {
      return false;
    }
  }

  return true;
};
const updateGraph = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/GraphSettings/${graphClone.value.uuid}`,
      {
        method: 'PUT',
        body: JSON.stringify(graphClone.value),
        headers
      }
    );
    props.fetchGraphs();

    toast('Graph updated succesfully');
  } catch (error) {
    console.log(error);
  }
};
const deleteGraph = async () => {
  try {
    await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/GraphSettings/${graphClone.value.uuid}`,
      {
        method: 'DELETE'
      }
    );
    if (props.selectedUserGraphList.includes(props.graph)) {
      const newselectedUserGraphList = [...props.selectedUserGraphList].filter(
        (item) => item !== props.graph
      );

      emit('update:childSelectedGraph', newselectedUserGraphList);
    }
    props.fetchGraphs();
    toast('Graph delete succesfully');
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="relative">
    <Button
      :variant="
        props.selectedUserGraphList.some((selectedGraph) => selectedGraph === props.graph.uuid)
          ? 'default'
          : 'outline'
      "
      @click="props.handleSelectUserGraph(props.graph)"
      class="group grid grid-cols-graph gap-4"
    >
      <span class="text-start truncate">
        {{ props.graph.name }}
      </span>
      <span class="text-start">
        {{
          new Date(props.graph.updatedAt)
            .toLocaleString('en-GB', { timeZone: 'UTC' })
            .toString()
            .slice(0, -10)
        }}
      </span>
      <div
        @click.stop="openModal(!isModalOpen)"
        class="hidden group-hover:inline-flex justify-center items-center hover:bg-palette-primary-100 px-2 relative"
      >
        <DotsIcon width="16" height="16" />
      </div>
    </Button>
    <Modal :toggle="closeModal" v-if="isModalOpen" class="left-24 bg-white right-40 w-[500px]">
      <GraphSettingsItem
        @update:childObject="updateParentObject"
        :graphSettings="graphClone"
        :fetchTags="props.fetchTags"
      />
      <div class="grid grid-cols-3 gap-8">
        <Button size="sm" variant="destructive" @click="deleteGraph">Delete</Button>
        <div class="col-span-2 flex justify-end gap-2">
          <Button size="sm" variant="outline" v-if="!isSame()" @click="cancelChanges"
            >Cancel change</Button
          >
          <Button size="sm" v-if="!isSame()" @click="updateGraph">Update Graph</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
