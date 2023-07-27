<script setup>
import { inject, watch, ref } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';
import RequestRow from '@/components/AdminView/RequestRow.vue';
import { useRouter } from 'vue-router';

const { user } = inject('user');
const router = useRouter();

const redirect = () => {
  if (user.value.status !== userStatusAdmin) {
    router.push('/404');
    return;
  }
};
redirect();
watch(user.value, () => {
  redirect();
});

const requestList = ref([]);
const x = ref(null);

const getPendingUserList = async () => {
  console.log('pending function user value', user)
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
  <div v-if="user.value.status === userStatusAdmin" class="p-8">
    <h1 class="text-palette-primary-500 font-bold text-4xl mb-8">Admin</h1>
    <section class="flex flex-col gap-2" v-if="requestList.length > 0">
      <RequestRow
        v-for="request in requestList"
        :key="request.id"
        :request="request"
        :getPendingUserList="getPendingUserList"
      />
    </section>
    <div v-else>LAODING</div>
  </div>
</template>
