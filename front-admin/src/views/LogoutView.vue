<script setup>
import { useRouter } from 'vue-router';
import { removeLocalStorageItem } from '@/utils';
import { onMounted } from 'vue';

const router = useRouter();

const logout = () => {
  removeLocalStorageItem('token');
  removeLocalStorageItem('graphSettings');
  router.push('/');
};
onMounted(() => {
  logout();
});
</script>

<template>
  <div></div>
</template>
