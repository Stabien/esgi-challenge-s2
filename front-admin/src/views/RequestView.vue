<script setup>
import { useRoute } from 'vue-router';
import Link from '@/components/ui/Link.vue';
import { requestList } from '@/utils/requestConstants';

const route = useRoute();
const requestUid = route.params.uid;
const request = requestList;
console.log(route.params);
console.log(request);
</script>

<template>
  <div>
    <Link to="/admin">Back to request</Link>
    {{ requestUid }}
  </div>
</template>
