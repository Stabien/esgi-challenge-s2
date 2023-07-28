<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['type', 'label', 'modelValue', 'required', 'oneLine', 'dataCy']);
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col w-full gap-2" :style="{ gridArea: props.label }">
    <label v-if="!props.oneLine" :for="props.label"
      >{{ props.label.replace('_', ' ') }}
      <span v-if="props.required" class="text-palette-primary-500">*</span>
    </label>

    <input
      :data-cy="props.dataCy"
      v-if="props.type !== 'file'"
      :required="props.required"
      :type="props.type"
      :id="props.label"
      :value="modelValue"
      :placeholder="props.oneLine ? props.label : null"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      :data-cy="props.dataCy"
      v-else
      :required="props.required"
      accept="application/pdf"
      :type="props.type"
      :id="props.label"
      @change="(event) => console.log(event)"
    />
  </div>
</template>
