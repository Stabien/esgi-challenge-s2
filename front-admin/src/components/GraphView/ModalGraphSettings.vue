<script setup>
import { inject, ref } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps(['fetchTags', 'fetchUserGraphList']);
const { user } = inject('user');
const toast = useToast();

const graphNameInput = ref('');

// const { graphSettings } = inject('graphSettings');
const graphSettings = ref(
  JSON.parse(localStorage.getItem('graphSettings')) || {
    appId: user.value.decodedToken.appId,
    data_type: 'quantity', //percentages or quantity
    graph_type: 'BarChart', //list of selected Graphs
    graphSize: 1, //size of graph: 1 to 10
    timeScale: 'D', //D, W, M,Y day, week, month, year
    tagUuid: '',
    graph_size: 'full',
    event: 'click' //click, newSession, navigation,
  }
);

const updateParentObject = (newObject) => {
  graphSettings.value = newObject;
};

const saveGraphSettings = async () => {
  try {
    console.log(graphNameInput.value);
    if (!graphNameInput.value) {
      toast.error('You need a graph name');
      return;
    }
    if (graphSettings.value.event === 'CTR' && !graphSettings.value.tagUuid) {
      toast.error('You need to pick a tag for CTR');
      return;
    }
    const bodyGraphSettings = {
      name: graphNameInput.value,
      userUuid: user.value.decodedToken.uuid,
      event: graphSettings.value.event,
      graphPeriod: graphSettings.value.timeScale,
      dataType: graphSettings.value.data_type,
      graphType: graphSettings.value.graph_type,
      graphSize: graphSettings.value.graph_size,
      selectedTagUuid: graphSettings.value.tagUuid
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(bodyGraphSettings),
      headers
    };
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/analytics/GraphSettings`, requestOptions);
    graphNameInput.value = '';
    props.fetchUserGraphList();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <Modal class="bg-white right-40">
    <GraphSettingsItem
      @update:childObject="updateParentObject"
      :graphSettings="graphSettings"
      :showFormTags="true"
      :fetchTags="props.fetchTags"
    />
    <Input
      v-if="user.status !== 'Admin'"
      type="text"
      label="Name of the graph"
      oneLine="true"
      v-model="graphNameInput"
      class="w-fit"
      required
    />
    <div>
      <Button @click="saveGraphSettings">Save</Button>
    </div>
  </Modal>
</template>
