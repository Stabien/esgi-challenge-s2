<script setup>
import { userStatusVisitor } from '@/utils/userConstant';
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { getLogo, decodeToken } from '@/utils';
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
const decodedToken = decodeToken();
const user = ref({ isLogged: !!decodedToken, status: userStatusVisitor });

const setIsLogged = (isLogged) => {
  user.value.isLogged = isLogged;
};
const setStatus = (status) => {
  user.value.status = status;
};

provide('user', {
  user,
  setIsLogged,
  setStatus
});
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
</template>
