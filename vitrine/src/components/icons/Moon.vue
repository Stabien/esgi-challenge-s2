<script setup>
defineProps(['size', 'color'])
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    name="moon"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    strokeWidth="8"
    strokeLinecap="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</template>
