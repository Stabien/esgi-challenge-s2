<script setup>
import { inject, watch } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';

import { useRouter } from 'vue-router';

const { user } = inject('user');
const router = useRouter();
const redirect = () => {
  console.log(user.value.status);
  if (user.value.status !== userStatusAdmin) router.push('/404');
};
redirect();
watch(user.value, () => {
  redirect();
});
</script>

<template>
  <div>Admin</div>
</template>
