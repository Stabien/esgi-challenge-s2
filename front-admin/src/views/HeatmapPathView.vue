<script setup>
import { onMounted, ref, inject, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userRequest = ref();
const isLoading = ref(false);
const maxHeight = ref(720);
const path = route.params.path.replaceAll('-', '/');
const { socket } = inject('socket');
const { graphSettings } = inject('graphSettings');

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

const fetchHeatmapData = async (isFetchImage = true) => {
  try {
    isLoading.value = true;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = {
      ...graphSettings,
      url: encodeURIComponent(path),
      appId: userRequest.value ? userRequest.value.appId : graphSettings.appId
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/heatmapUrl/${JSON.stringify(body)}`,
      {
        method: 'GET',
        headers
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
    await generateHeatmap(data);
    const maxY = [...data].reduce(
      (max, obj) => (obj.y > max ? obj.y : max),
      Number.MIN_SAFE_INTEGER
    );
    console.log(maxY);
    // if (maxY > maxHeight.value) {
    //   maxHeight.value = maxY;
    // }
    if (isFetchImage) {
      await generateImage();
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};
const generateHeatmap = (data) => {
  const canvas = document.getElementById('heatmapCanvas');
  const context = canvas.getContext('2d');
  const colorScale = ['blue', 'green', 'yellow', 'orange', 'red'];
  const groupedData = {};
  data.forEach((point) => {
    const { x, y } = point;
    const roundedX = Math.round(x / 10) * 10;
    const roundedY = Math.round(y / 10) * 10;
    const key = `${roundedX}-${roundedY}`;
    if (!groupedData[key]) {
      groupedData[key] = { x: roundedX, y: roundedY, count: 0 };
    }
    groupedData[key].count++;
  });
  const maxCount = Math.max(...Object.values(groupedData).map((group) => group.count));
  Object.values(groupedData).forEach((group) => {
    const { x, y, count } = group;
    context.beginPath();
    context.arc(x, y, 10 + count * 3, 0, Math.PI * 2);
    const colorIndex = Math.floor((count / maxCount) * (colorScale.length - 1));
    context.fillStyle = colorScale[colorIndex];
    context.fill();
    context.closePath();
  });
};
const generateImage = () => {
  console.log('gona fetch');
  const websiteUrl = `http://44.211.138.101:3001${path}`; // URL du site Web à capturer
  //   const websiteUrl = 'https://unsplash.com/fr'; // URL du site Web à capturer
  const imageSize = { w: 1280, h: maxHeight.value }; // Taille de l'image
  const apiKey = 'NThkODRhNzJkNTVjNDBmODhkZDlhOWU4MjUzYTY2NDU=';
  // eslint-disable-next-line no-undef
  GrabzIt(apiKey)
    .ConvertURL(websiteUrl, { width: imageSize.w, height: imageSize.h })
    .AddTo('image-container');

  // NThkODRhNzJkNTVjNDBmODhkZDlhOWU4MjUzYTY2NDU=
  // NRd8Pz9fRAk/dg8/Pz8/WD96Pz9sPz8/Pz8/QkEGPz8=
};
const init = async () => {
  if (route.params.uuid) await fetchUserRequest();
  fetchHeatmapData();
};

onMounted(() => {
  init();

  socket.on('newDataAdded', () => {
    fetchHeatmapData(false);
  });
});

onUnmounted(() => socket.removeAllListeners('newDataAdded'));
</script>

<template>
  <main v-show="!isLoading">
    <Link to="/heatmap"><ArrowLeft /></Link>
    <div>{{ path }}</div>
    <div
      class="relative mx-auto"
      :style="{
        width: '1280px',
        height: `${maxHeight}px`
      }"
    >
      <div id="image-container" class="opacity-50 absolute object-contain top-0 left-0 z-10"></div>
      <canvas
        class="absolute top-0 left-0 z-20"
        id="heatmapCanvas"
        width="1280"
        :height="maxHeight"
      />
    </div>
  </main>
</template>
