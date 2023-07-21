<script setup>
import { RouterView } from 'vue-router'
import Layout from '@/components/Layout.vue'
import { getLogo } from '@/utils'
import { ref } from 'vue'
// Change FavIcon
var link = document.querySelector("link[rel~='icon']")
if (!link) {
  link = document.createElement('link')
  link.rel = 'icon'
  document.head.appendChild(link)
}
link.href = getLogo()

//Custom cursor
const mouseX = ref(0)
const visibility = ref(0)
const mouseY = ref(0)

window.addEventListener('mousemove', (e) => {
  if (e.clientX < window.innerWidth - 16 / 2) mouseX.value = e.clientX
  if (e.clientY < window.innerHeight - 16 / 2) mouseY.value = e.clientY
})
document.addEventListener('mouseenter', () => {
  console.log('je suis dedans')
  visibility.value = 'visible'
})
document.addEventListener('mouseout', () => {
  console.log('je suis dehors')
  // visibility.value = 'hidden'
})
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
  <span
    ref="cursor"
    :style="{ left: mouseX + 'px', top: mouseY + 'px', visibility: visibility }"
    class="fixed origin-center h-4 w-4 bg-palette-primary-500 mix-blend-difference invert rounded-full opacity-60 pointer-events-none"
  ></span>
</template>
