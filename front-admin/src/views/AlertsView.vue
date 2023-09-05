<script setup>
import { onMounted, ref, inject, provide } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import AlertsRow from '../components/GraphView/AlertsRow.vue';

const toast = useToast();
const route = useRoute();
const { user } = inject('user');

const userRequest = ref();
const isModalOpen = ref(false);
const userAlerts = ref([]);
const tagsList = ref([]);
const userGraphList = ref([]);
const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const alertSettings = ref({
  appId: user.value.decodedToken.appId,
  app_id: user.value.decodedToken.appId,
  graphUuid: '',
  // userUuid: user.value.decodedToken.uuid,
  // data_type: 'quantity', //percentages or quantity
  // graph_type: 'BarChart', //list of selected Graphs

  name: '',
  type: 'email', //email or http
  email: '',
  uri: '',
  time_before_new_alert: 0,
  time_scale: 'day',
  valueToTrigger: 0
});
provide('tagsList', { tagsList });

const toggleModalOpen = (isOpen) => (isModalOpen.value = isOpen);

const updateParentObject = (newObject) => {
  alertSettings.value = newObject;
};

const fetchUserGraphList = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/GraphSettings/${userRequest.value.uuid}`,
      {
        method: 'GET'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    userGraphList.value = [...data.filter((item) => !userGraphList.value.includes(item))];
  } catch (error) {
    console.log(error);
  }
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

const fetchUsersAlerts = async () => {
  try {
    console.log(userRequest.value);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/alerts/${userRequest.value.appId}`,
      {
        method: 'GET',
        headers,
        redirect: 'follow'
      }
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    userAlerts.value = data;
  } catch (error) {
    console.log(error);
  }
};

const postUserAlerts = async () => {
  try {
    if (alertSettings.value.name === '') {
      toast.error("you need an alert's name");
      return;
    }
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

    console.log(alertSettings.value);
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
  await fetchUserGraphList();
  await fetchUsersAlerts();
};

onMounted(() => {
  init();
});
</script>

<template>
  <main>
    <Button @click="() => toggleModalOpen(!isModalOpen)"> Tooggle</Button>
    <Modal :toggle="() => toggleModalOpen(false)" v-if="isModalOpen">
      <form class="flex flex-col gap-2" @submit.prevent="postUserAlerts">
        <AlertsItem
          :tagsList="tagsList"
          :userGraphList="userGraphList"
          @update:childObject="updateParentObject"
          :alertSettings="alertSettings"
        />
        <Button type="submit"> Save</Button>
      </form>
    </Modal>
    <AlertsRow
      v-for="alert in userAlerts.map(
        ({ tag_uuid, timeBeforeNewAlert, valueToTrigger, timeScale, dataType, ...rest }) => ({
          tagUuid: tag_uuid,
          data_type: dataType,
          time_scale: timeScale,
          time_before_new_alert: timeBeforeNewAlert,
          value_to_trigger: valueToTrigger,
          ...rest
        })
      )"
      :key="alert.uuid"
      :alert="alert"
      :fetchAlerts="fetchUsersAlerts"
      :userGraphList="userGraphList"
    />
  </main>
</template>
