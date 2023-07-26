<script setup>
import CheckIcon from '@/components/icons/CheckIcon.vue';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import RefusedIcon from '@/components/icons/RefusedIcon.vue';
import { PENDING, REJECTED, VALIDATED } from '@/utils/requestConstants';
import { defineProps } from 'vue';

const props = defineProps(['request', 'getPendingUserList']);

console.log(props.request);

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

const handleRequest = async (status, uuid) => {
  try {
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
    props.getPendingUserList();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <article
    :style="{
      gridTemplateAreas: `'icon last first email url buttons'`
    }"
    class="bg-palette-gray-50 grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center rounded p-4 grid grid-rows-1 gap-4"
  >
    <div :style="{ gridArea: 'icon' }">
      <PendingIcon
        v-if="props.request.status === PENDING"
        height="24"
        width="24"
        class="text-palette-gray-300"
      />
      <CheckIcon
        v-if="props.request.status === VALIDATED"
        height="24"
        width="24"
        class="text-palette-green"
      />
      <RefusedIcon
        v-if="props.request.status === REJECTED"
        height="24"
        width="24"
        class="text-palette-primary-500"
      />
    </div>
    <div :style="{ gridArea: 'first' }" class="font-bold text-xl">
      {{ props.request.firstname }}
    </div>
    <div :style="{ gridArea: 'last' }" class="font-bold text-xl">{{ props.request.lastname }}</div>
    <div :style="{ gridArea: 'email' }">{{ props.request.email }}</div>
    <div :style="{ gridArea: 'url' }">{{ props.request.url }}</div>
    <div :style="{ gridArea: 'buttons' }" class="flex gap-2">
      <Button
        v-if="props.request.status === PENDING"
        variant="outline"
        @click="() => handleRequest(VALIDATED, props.request.uuid)"
      >
        <CheckIcon height="24" width="24" class="text-palette-green" />
      </Button>
      <Button
        v-if="props.request.status === PENDING"
        variant="outline"
        @click="() => handleRequest(REJECTED, props.request.uuid)"
      >
        <RefusedIcon height="24" width="24" class="text-palette-primary-500" />
      </Button>
      <Button v-else variant="ghost" @click="() => handleRequest(PENDING, props.request.uuid)">
        <!-- <PendingIcon height="24" width="24" class="text-palette-gray-300" /> -->
        Cancel
      </Button>
    </div>

    <!-- <Link :to="`/props.request/${props.request.uuid}`">
        <ArrowLeft transform="rotate(180)" />
      </Link> -->
  </article>
</template>
