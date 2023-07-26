<script setup>
import { inject, watch, ref } from 'vue';
import { userStatusAdmin } from '@/utils/userConstant';
import RequestRow from '@/components/AdminView/RequestRow.vue';
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

const requestList = ref([]);
const x = ref(null);

const getPendingUserList = async () => {
  console.log('je fetch');
  try {
    const result = await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/admin/userRegistrations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!result.ok) {
      // Gérer les erreurs de réponse ici si besoin
      throw new Error("La requête n'a pas abouti");
    }
    const data = await result.json();

    requestList.value = data;
    x.value = data[0];
  } catch (error) {
    console.log(error);
  }
};

getPendingUserList();
</script>

<template>
  <div class="p-8">
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
