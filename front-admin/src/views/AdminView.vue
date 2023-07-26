<script setup>
import { inject, watch } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';
import { useRouter } from 'vue-router';
import RequestRow from '@/components/AdminView/RequestRow.vue';
import { requestList } from '@/utils/requestConstants';
const { user } = inject('user');
const router = useRouter();

const redirect = () => {
  if (user.value.status !== userStatusAdmin) {
    // router.push('/404');
  }
};
redirect();
watch(user.value, () => {
  redirect();
});
</script>

<template>
  <div class="m-4">
    <h1 class="text-palette-primary-500">Admin</h1>
    <section class="flex flex-col gap-2">
      <RequestRow v-for="request in requestList" :key="request.id" :request="request" />
    </section>
  </div>
</template>
