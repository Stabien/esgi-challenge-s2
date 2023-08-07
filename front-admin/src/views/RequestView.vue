<script setup>
import { useRoute, useRouter } from 'vue-router';
import { inject, onMounted, ref, onUnmounted } from 'vue';
import Link from '@/components/ui/Link.vue';
import { REJECTED, VALIDATED, PENDING } from '@/utils/requestConstants';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const { user } = inject('user');
const { socket } = inject('socket');
const requestUid = route.params.uid || user.value.decodedToken.uuid;

const userRequest = ref();
const isLoading = ref(false);
const isEditing = ref(false);

const toggleEdit = () => (isEditing.value = !isEditing.value);
const cancelEdit = () => {
  isEditing.value = false;
  fetchUserRequest();
};

const saveEdit = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/user/${requestUid}`, {
      method: 'PUT',
      body: JSON.stringify(userRequest.value),
      headers
    });
    fetchUserRequest();
    toast('Your profile has been modified');
  } catch (error) {
    console.log(error);
  }
  isEditing.value = false;
};

const isMe = () => requestUid === user.value.decodedToken.uuid;

const getCorrectRequest = (status) => {
  switch (status) {
    case REJECTED:
      return 'rejectUser';
    case VALIDATED:
      return 'validateUser';

    default:
      return 'pendingUser';
  }
};

const updateUserStatus = async (status, uuid) => {
  try {
    isLoading.value = true;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/admin/${getCorrectRequest(status)}/${uuid}`,
      {
        method: 'PUT',
        headers: {
          headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    socket.emit('updateUserDocument', userRequest.value.appId);
    fetchUserRequest();
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const fetchUserRequest = async () => {
  try {
    isLoading.value = true;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/user/${requestUid}`, {
      method: 'GET',
      headers: {
        headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    userRequest.value = data;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

onMounted(() => {
  if (!user.value.isLogged) router.push('/');

  fetchUserRequest();

  socket.on('updateUserDocument', () => fetchUserRequest());
});

onUnmounted(() => {
  socket.removeAllListeners('updateUserDocument');
});
</script>

<template>
  <div>
    <div
      v-if="!!userRequest && !isLoading"
      :style="{
        'grid-template-columns': '2fr 1fr'
      }"
      class="grid border border-palette-gray-300 gap-4 p-4 rounded mx-10 lg:mx-40"
    >
      <div class="flex gap-2 items-center">
        <Link :to="user.isAdmin ? '/admin' : '/'" variant="ghost" class=""
          ><ArrowLeft class="h-6 w-6 text-palette-primary-500"
        /></Link>
        <div class="text-palette-primary-500 text-4xl uppercase font-bold">
          status :
          <span
            class="font-bold"
            :class="
              userRequest.status === PENDING
                ? 'text-palette-gray-500'
                : userRequest.status === VALIDATED
                ? 'text-palette-green'
                : 'text-red-500'
            "
          >
            {{ userRequest.status }}
          </span>
        </div>
      </div>
      <div
        class="row-span-2 bg-palette-gray-100 h-full w-full flex justify-center items-center rounded"
      >
        PDF
      </div>

      <div
        :style="{
          'grid-template-areas': `'email appId' 'firstname lastname''society url' '. buttons'`
        }"
        class="grid grid-cols-2 gap-4"
      >
        <Input :disabled="!isEditing" type="text" label="email" v-model="userRequest.email" />
        <Input :disabled="!isEditing" type="text" label="appId" v-model="userRequest.appId" />
        <Input
          :disabled="!isEditing"
          type="text"
          label="firstname"
          v-model="userRequest.firstname"
        />
        <Input :disabled="!isEditing" type="text" label="lastname" v-model="userRequest.lastname" />
        <Input
          :disabled="!isEditing"
          type="text"
          label="society"
          v-model="userRequest.societyName"
        />
        <Input
          class="w-fit"
          :disabled="!isEditing"
          type="text"
          label="url"
          v-model="userRequest.url"
        />
        <div
          :style="{
            'grid-area': 'buttons'
          }"
        >
          <div class="flex gap-2 items-end justify-end" v-if="user.status === 'Admin'">
            <Button
              v-if="userRequest.status === PENDING"
              variant="outline"
              @click="() => updateUserStatus(VALIDATED, userRequest.uuid)"
            >
              <CheckIcon height="24" width="24" class="text-palette-green mr-2" />Validate
            </Button>
            <Button
              v-if="userRequest.status === PENDING"
              variant="outline"
              @click="() => updateUserStatus(REJECTED, userRequest.uuid)"
            >
              <RefusedIcon height="24" width="24" class="text-palette-primary-500 mr-2" />Reject
            </Button>
            <Button
              v-else
              variant="outline"
              @click="() => updateUserStatus(PENDING, userRequest.uuid)"
            >
              <PendingIcon height="24" width="24" class="text-palette-gray-300 mr-2" />
              Go back to pending
            </Button>
          </div>
          <div class="flex gap-2 items-end justify-end" v-else-if="isMe()">
            <Button v-if="!isEditing" variant="outline" @click="toggleEdit">Edit</Button>
            <Button v-if="isEditing" variant="outline" @click="cancelEdit">Cancel</Button>
            <Button v-if="isEditing" variant="default" @click="saveEdit">Save</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center">
      <LoadingIcon class="h-40 w-40 text-palette-primary-500" />
    </div>
  </div>
</template>
