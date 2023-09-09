<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['tagsList', 'userGraphList', 'alertSettings']);
console.log(props.alertSettings);
console.log(props.tagsList);
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
const alertType = ['email', 'http'];
const time_scaleList = ['day', 'hours'];

const setGraphUuid = (graph) => {
  const updatedObject = { ...props.alertSettings, graphUuid: graph.uuid };
  emitAlert(updatedObject);
};
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
const setName = (name) => {
  const updatedObject = { ...props.alertSettings, name: name };
  emitAlert(updatedObject);
};

const setValueToTrigger = (valueToTrigger) => {
  const updatedObject = { ...props.alertSettings, valueToTrigger: parseInt(valueToTrigger) };
  emitAlert(updatedObject);
};
const setTimeNewAlert = (time_before_new_alert) => {
  const updatedObject = {
    ...props.alertSettings,
    time_before_new_alert: parseInt(time_before_new_alert)
  };
  emitAlert(updatedObject);
};
const setTimeScale = (time_scale) => {
  const updatedObject = {
    ...props.alertSettings,
    time_scale: time_scale
  };
  emitAlert(updatedObject);
};

const emitAlert = (updatedObject) => emit('update:childObject', updatedObject);
</script>

<template>
  <div class="flex justify-between gap-4">
    <div
      :class="
        props.alertSettings.graphUuid === userGraph.uuid
          ? 'text-palette-primary-500 border border-palette-primary-500 '
          : 'text-palette-gray-300'
      "
      class="text-sm rounded p-1 cursor-pointer flex items-center justify-between dark:text-soft-black relative"
      v-for="userGraph in userGraphList"
      :key="userGraph"
      @click="setGraphUuid(userGraph)"
    >
      {{ userGraph.name }}
    </div>
  </div>
  <div class="w-1/2 mx-auto flex justify-between gap-4">
    <div
      type="button"
      :class="
        props.alertSettings.type === alert
          ? 'text-palette-primary-500 border border-palette-primary-500 '
          : 'text-palette-gray-300'
      "
      class="text-sm rounded p-1 cursor-pointer flex items-center justify-between dark:text-soft-black relative"
      v-for="alert in alertType"
      :key="alert"
      @click="setAlertType(alert)"
    >
      {{ alert }}
    </div>
  </div>
  <input
    placeholder="email for alert"
    v-if="props.alertSettings.type === 'email'"
    type="email"
    :value="props.alertSettings.email"
    @input="(e) => setEmail(e.target.value)"
  />
  <input
    placeholder="HTTP URL for alert"
    v-if="props.alertSettings.type === 'http'"
    type="text"
    :value="props.alertSettings.uri"
    @input="(e) => setUri(e.target.value)"
  />
  <div class="flex items-center gap-4">
    Time before new alerts:
    <input
      class="w-[80px]"
      type="number"
      min="0"
      :value="props.alertSettings.time_before_new_alert"
      @input="(e) => setTimeNewAlert(e.target.value)"
    />
    {{ props.alertSettings.time_scale }}
  </div>
  <div class="w-1/2 mx-auto justify-between flex items-center gap-4">
    <div
      :class="
        props.alertSettings.time_scale === timeScale
          ? 'text-palette-primary-500 border border-palette-primary-500 '
          : 'text-palette-gray-300'
      "
      class="text-sm rounded p-1 cursor-pointer flex items-center justify-between dark:text-soft-black relative"
      v-for="timeScale in time_scaleList"
      :key="timeScale"
      @click="setTimeScale(timeScale)"
    >
      {{ timeScale }}
    </div>
  </div>
  <div class="flex items-center gap-4" title="see your graph to check if quantity or percentages">
    Value to trigger: {{ props.alertSettings.valueToTrigger }}
    <input
      class="w-[80px]"
      type="number"
      min="0"
      :value="props.alertSettings.valueToTrigger"
      @input="(e) => setValueToTrigger(e.target.value)"
    />
  </div>
  <input
    placeholder="Alert's name"
    type="text"
    :value="props.alertSettings.name"
    @input="(e) => setName(e.target.value)"
  />
</template>
