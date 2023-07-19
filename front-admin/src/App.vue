<script setup>
import { RouterView } from 'vue-router'
import Layout from '@/components/Layout.vue'
import { getLogo, setLogo } from '@/utils'
setLogo()
var link = document.querySelector("link[rel~='icon']")
if (!link) {
  link = document.createElement('link')
  link.rel = 'icon'
  document.head.appendChild(link)
}
link.href = getLogo()
</script>

<template>
  <Layout />
  <RouterView />
</template>
