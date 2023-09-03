<script setup>
import { onMounted, onUnmounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { graphSettings } = inject('graphSettings');
const { socket } = inject('socket');
const { user } = inject('user');

const userRequest = ref();
const heatmapPossibilityList = ref([]);

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
  await fetchUserRequest();
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
  <main class="mx-4">
    <h1 class="text-soft-black dark:text-soft-white text-2xl mb-8">
      Click to see the heatmap of the specified page :
      <span v-if="userRequest" class="text-palette-primary-500 font-bold">
        {{ userRequest.url }}
      </span>
    </h1>
    <div class="flex gap-8 flex-wrap">
      <Link
        variant="ghost"
        v-for="possibility in heatmapPossibilityList.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))"
        :key="possibility"
        :to="
          route.params.uuid
            ? `/user-heatmapPath/${route.params.uuid}/${possibility.replaceAll('/', '-')}`
            : `/heatmapPath/${possibility.replaceAll('/', '-')}`
        "
        class=""
      >
        {{ possibility }}
      </Link>
    </div>
  </main>
</template>
