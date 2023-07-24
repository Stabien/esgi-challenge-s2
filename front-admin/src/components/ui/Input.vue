<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['type', 'label', 'modelValue', 'required']);
defineEmits(['update:modelValue']);
</script>

<template>
  <label :for="props.label"
    >{{ props.label }}
    <span v-if="props.required" class="text-palette-primary-500">*</span>
  </label>

  <input
    v-if="props.type !== 'file'"
    :required="props.required"
    :type="props.type"
    :id="props.label"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  <input
    v-else
    :required="props.required"
    accept="application/pdf"
    :type="props.type"
    :id="props.label"
    @change="(event) => console.log(event)"
  />
</template>
