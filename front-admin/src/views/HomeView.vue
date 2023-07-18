<script setup>
import Button from '../components/ui/Button.vue'

const test = () => {
  console.log('je suis un test')
}
</script>

<template>
  <div class="about">
    <h1>This is an Home page</h1>
    <Button :onClick="test">test</Button>
  </div>
</template>
