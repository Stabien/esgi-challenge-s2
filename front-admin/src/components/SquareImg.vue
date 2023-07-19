<script setup>
import { getOcto } from '@/utils'
import { ref } from 'vue'

defineProps(['src'])

const array = new Array(36)
const startValue = 0
const endValue = 10
const duration = 0.3 // Temps en secondes
const currentValue = ref(startValue)
const animateValue = () => {
  const increment = (endValue - startValue) / (duration * 60) // 60 FPS
  let current = startValue

  const updateValue = () => {
    current += increment
    currentValue.value = current

    if (current < endValue) {
      requestAnimationFrame(updateValue)
    } else {
      currentValue.value = endValue // Assurez-vous que la valeur finale soit exacte
    }
  }
  requestAnimationFrame(updateValue)
}
animateValue()
</script>

<template>
  <div class="absolute z-50 mix-blend-difference invert">
    <div
      :style="{ clipPath: getOcto(currentValue) }"
      class="w-full h-full relative grid grid-rows-6 grid-cols-6"
    >
      <img :src="src" class="absolute z-10 h-full object-cover" alt="" srcset="" />
      <div
        src="https://flim-1-0-2.s3.eu-central-1.amazonaws.com/thumbs/hd_720px/dfa321a0852e11ecaf6c10ddb1aba44f.jpeg"
        class="absolute z-20 bg-palette-primary-500 mix-blend-screen w-full h-full object-cover"
        alt=""
        srcset=""
      ></div>

      <span
        v-for="item in array"
        class="z-30 square hover:bg-yellow-100 hover:bg-opacity-60 duration-100"
        :key="item"
      ></span>
    </div>
  </div>
</template>

<style>
.square-container {
  transition-property: clip-path;
}
.square {
  transition-duration: 800ms;
}
.square:hover {
  transition-duration: 10ms;
}
</style>
