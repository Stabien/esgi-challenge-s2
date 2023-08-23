<script setup>
import { onMounted, onUnmounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { graphSettings } = inject('graphSettings');
const { socket } = inject('socket');

const userRequest = ref();
const heatmapPossibilityList = ref([]);

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

const fetchHeatmapsPossibility = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/heatmap/${JSON.stringify({
        ...graphSettings,
        appId: userRequest.value ? userRequest.value.appId : graphSettings.appId
      })}`,
      {
        method: 'GET',
        headers,
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    if (data.length === 0) {
      heatmapPossibilityList.value = [];
      return;
    }
    heatmapPossibilityList.value = data[0].uniqueUrls;
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  if (route.params.uuid) await fetchUserRequest();
  fetchHeatmapsPossibility();
};

onMounted(() => {
  init();
});
onMounted(() => {
  init();

  socket.on('newDataAdded', () => {
    fetchHeatmapsPossibility(false);
  });
});

onUnmounted(() => socket.removeAllListeners('newDataAdded'));
</script>

<template>
  <main>
    <Link
      :to="`/heatmapPath/${possibility.replaceAll('/', '-')}`"
      v-for="possibility in heatmapPossibilityList"
      :key="possibility"
    >
      {{ possibility }}
    </Link>
    <!-- <canvas class="bg-red-500" id="heatmapCanvas" width="1920" height="8080" /> -->
  </main>
</template>
