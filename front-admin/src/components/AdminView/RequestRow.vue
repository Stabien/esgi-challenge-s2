<script setup>
import { defineProps } from 'vue';
import { REJECTED, VALIDATED, PENDING } from '@/utils/requestConstants';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import RefusedIcon from '@/components/icons/RefusedIcon.vue';

defineProps(['request']);
</script>

<template>
  <article
    :style="{
      gridTemplateAreas: `'icon email url arrow'`
    }"
    class="bg-palette-gray-50 grid-cols-[auto_2fr_1fr_auto] rounded p-4 grid grid-rows-1 gap-4"
  >
    <div :style="{ gridArea: 'icon' }">
      <PendingIcon
        v-if="request.status === PENDING"
        height="24"
        width="24"
        class="text-palette-gray-300"
      />
      <CheckIcon
        v-if="request.status === VALIDATED"
        height="24"
        width="24"
        class="text-palette-green"
      />
      <RefusedIcon
        v-if="request.status === REJECTED"
        height="24"
        width="24"
        class="text-palette-primary-500"
      />
    </div>
    <div :style="{ gridArea: 'email' }">{{ request.email }}</div>
    <div :style="{ gridArea: 'url' }">{{ request.url }}</div>
    <div :style="{ gridArea: 'arrow' }">
      {{ request.id }}
    </div>
  </article>
</template>
