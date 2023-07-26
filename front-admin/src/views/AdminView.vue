<script setup>
import { inject, watch } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';
import RequestRow from '@/components/AdminView/RequestRow.vue';
import { requestList } from '@/utils/requestConstants';
const { user } = inject('user');

const redirect = () => {
  if (user.value.status !== userStatusAdmin) {
    // router.push('/404');
  }
};
redirect();
watch(user.value, () => {
  redirect();
});

const getPendingUserList = async () => {
  try {
    const result = await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/admin/userRegistrations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await result.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
getPendingUserList();
</script>

<template>
  <div class="m-4">
    <h1 class="text-palette-primary-500">Admin</h1>
    <section class="flex flex-col gap-2">
      <RequestRow v-for="request in requestList" :key="request.id" :request="request" />
    </section>
  </div>
</template>
