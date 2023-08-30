<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const { user } = inject('user');

const userRequest = ref();
const userAlerts = ref([]);
const tagsList = ref([]);
const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const alertSettings = ref({
  userUuid: user.value.decodedToken.uuid,
  tagUuid: '',
  type: 'email', //email or http
  email: '', //size of graph: 1 to 10
  uri: '', //D, W, M,Y day, week, month, year
  time_before_new_alert: '',
  data_type: '',
  time_scale: '' //click, newSession, navigation,
});

const updateParentObject = (newObject) => {
  alertSettings.value = newObject;
};

const fetchUserRequest = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/user/${
        route.params.uuid ? route.params.uuid : user.value.decodedToken.uuid
      }`,
      {
        method: 'GET',
        headers
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    userRequest.value = data;
  } catch (error) {
    console.log(error);
  }
};
const fetchTags = async () => {
  try {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/tag/${userRequest.value.uuid}`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    tagsList.value = data;
  } catch (error) {
    console.log(error);
  }
};

const fetchUsersAlerts = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/alerts/${userRequest.value.uuid}`,
      {
        method: 'GET',
        headers,
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    console.log(data);
    userAlerts.value = data;
  } catch (error) {
    console.log(error);
  }
};

const postUserAlerts = async () => {
  try {
    if (alertSettings.value.type === 'email') {
      if (!emailRegex.test(alertSettings.value.email)) {
        toast.error('Email is not valid');
        return;
      }
    } else {
      if (!regexUrl.test(alertSettings.value.uri)) {
        toast.error('Url is not valid');
        return;
      }
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/alerts`, {
      method: 'POST',
      body: JSON.stringify(alertSettings.value),

      headers
    });
    await fetchUsersAlerts();

    // if (!response.ok) throw new Error('Something went wrong');

    // const data = await response.json();
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  await fetchUserRequest();
  await fetchTags();
  await fetchUsersAlerts();
};

onMounted(() => {
  init();
});
</script>

<template>
  <main>
    <form @submit.prevent="postUserAlerts">
      <AlertsItem
        :tagsList="tagsList"
        @update:childObject="updateParentObject"
        :alertSettings="alertSettings"
      />
      <Button type="submit"> Save</Button>
    </form>
    <div v-for="alert in userAlerts" :key="alert.uuid">{{ alert.email }}</div>
  </main>
</template>
