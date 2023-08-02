<script setup>
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { getLogo, getConnectionProviderValue } from '@/utils';
import { provide, ref } from 'vue';

// Change FavIcon
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
}
link.href = getLogo();

//verify if already connected

const providerValue = getConnectionProviderValue();
const user = ref(providerValue);

window.addEventListener('local-storage-updated', () => {
  const newProviderValue = getConnectionProviderValue();
  user.value = newProviderValue;
});
window.addEventListener('storage', () => {
  const newProviderValue = getConnectionProviderValue();
  user.value = newProviderValue;
});

provide('user', {
  user
});
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
</template>
