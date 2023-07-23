<script setup>
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { getLogo } from '@/utils';
import { provide, ref } from 'vue';

// Change FavIcon
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
}
link.href = getLogo();

const user = ref({ isLogged: true });

const setIsLogged = (isLogged) => {
  user.value.isLogged = isLogged;
};

provide('user', {
  user,
  setIsLogged
});
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
  <!-- <span
    ref="cursor"
    :style="{ left: mouseX + 'px', top: mouseY + 'px', visibility: visibility }"
    class="fixed origin-center h-4 w-4 bg-palette-primary-500 mix-blend-difference invert rounded-full opacity-60 pointer-events-none"
  ></span> -->
</template>
