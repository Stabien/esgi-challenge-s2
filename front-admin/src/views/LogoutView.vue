<script setup>
import { useRouter } from 'vue-router';
import { removeLocalStorageItem } from '@/utils';
import { onMounted } from 'vue';

const router = useRouter();

const logout = () => {
  console.log('dsdsdf');
  removeLocalStorageItem('token');
  console.log(router);
  router.push('/');
};
onMounted(() => {
  logout();
});
</script>

<template>
  <div></div>
</template>
