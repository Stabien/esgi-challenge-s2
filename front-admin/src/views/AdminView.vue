<script setup>
import { inject, ref } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';
import RequestRow from '@/components/AdminView/RequestRow.vue';

const { user } = inject('user');

const requestList = ref([]);
const x = ref(null);

const getPendingUserList = async () => {
  if (user.value.status !== userStatusAdmin) return;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/admin/userRegistrations`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();

    requestList.value = data;
    x.value = data[0];
  } catch (error) {
    console.log(error);
  }
};

getPendingUserList();
</script>

<template>
  <div v-if="user.status === userStatusAdmin" class="p-8 mx-40">
    <h1 class="text-palette-primary-500 font-bold text-4xl mb-8">Admin</h1>
    <section class="flex flex-col gap-2" v-if="requestList.length > 0">
      <RequestRow
        v-for="request in requestList.sort((a, b) =>
          a.status === 'PENDING' && b.status !== 'PENDING'
            ? -1
            : a.status !== 'PENDING' && b.status === 'PENDING'
            ? 1
            : 0
        )"
        :key="request.id"
        :request="request"
        :getPendingUserList="getPendingUserList"
      />
    </section>
    <div v-else class="flex items-center justify-center">
      <LoadingIcon class="h-40 w-40 text-palette-primary-500" />
    </div>
  </div>
</template>
