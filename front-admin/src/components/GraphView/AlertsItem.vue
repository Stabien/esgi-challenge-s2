<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['tagsList', 'alertSettings', 'fetchTags']);

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
const alertType = ['email', 'http'];

const setAlertType = (type) => {
  const updatedObject = { ...props.alertSettings, type: type };
  emitAlert(updatedObject);
};
const setEmail = (email) => {
  const updatedObject = { ...props.alertSettings, email: email };
  emitAlert(updatedObject);
};
const setUri = (uri) => {
  const updatedObject = { ...props.alertSettings, uri: uri };
  emitAlert(updatedObject);
};
const setTagUuid = (tagUuid) => {
  const updatedObject = { ...props.alertSettings, tagUuid: tagUuid };
  emitAlert(updatedObject);
};

const emitAlert = (updatedObject) => emit('update:childObject', updatedObject);
</script>

<template>
  <div>
    <div
      type="button"
      :class="props.alertSettings.type === alert ?'bg-palette-primary-100' : 'bg-soft-white'"
      class="text-sm rounded flex items-center justify-between dark:text-soft-black relative"

      v-for="alert in alertType"
      :key="alert"
      @click="setAlertType(alert)"
    >
      {{ alert }}
  </div>
    <input
      v-if="props.alertSettings.type === 'email'"
      type="email"
      :value="props.alertSettings.email"
      @input="(e) => setEmail(e.target.value)"
    />
    <input
      v-if="props.alertSettings.type === 'http'"
      type="text"
      :value="props.alertSettings.uri"
      @input="(e) => setUri(e.target.value)"
    />
    <div
      type="button"
      :class="props.alertSettings.tagUuid === tag.uuid ? 'bg-palette-primary-100' : 'bg-soft-white'"
      class="text-sm rounded flex items-center justify-between dark:text-soft-black relative"

      @click="setTagUuid(tag.uuid)"
      v-for="tag in props.tagsList"
      :key="tag.uuid"
      >{{ tag.name }}
    </div>
  </div>
</template>
