<script setup>
import { inject } from 'vue';

const { graphSettings } = inject('graphSettings');
</script>

<template>
  <Modal class="bg-white">
    <input type="range" min="1" max="10" v-model="graphSettings.graphSize" />
  </Modal>
</template>
