<script setup>
import CheckIcon from '@/components/icons/CheckIcon.vue';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import RefusedIcon from '@/components/icons/RefusedIcon.vue';
import { PENDING, REJECTED, VALIDATED } from '@/utils/requestConstants';
import { defineProps } from 'vue';

const props = defineProps(['request', 'getPendingUserList']);
</script>

<template>
  <article
    :style="{
      gridTemplateAreas: `'icon email last buttons'`
    }"
    class="bg-palette-gray-50 dark:bg-palette-gray-800 grid-cols-[auto_1fr_1fr_auto] items-center rounded p-4 grid grid-rows-1 gap-4"
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
    <div :style="{ gridArea: 'email' }">{{ props.request.email }}</div>
    <!-- <div :style="{ gridArea: 'last' }" class="font-bold text-xl">{{ props.request.lastname }}</div> -->
    <div :style="{ gridArea: 'buttons' }" class="flex gap-2 place-self-end">
      <Link :to="`/admin-user/${props.request.uuid}`">
        <ArrowBracketIcon class="h-6 w-6 text-white" />
      </Link>
    </div>
  </article>
</template>
