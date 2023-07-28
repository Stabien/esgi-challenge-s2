<script setup>
import { useRoute } from 'vue-router';
import Link from '@/components/ui/Link.vue';

const route = useRoute();
const requestUid = route.params.uid;
</script>

<template>
  <div>
    <Link to="/admin">Back to request</Link>
    {{ requestUid }}
  </div>
</template>
