<script setup>
import Button from '@/components/ui/Button.vue';
import { ref } from 'vue';
const cart = ref([]);
// Load cart from localStorage on component mount
if (localStorage.getItem('cart')) {
  cart.value = JSON.parse(localStorage.getItem('cart'));
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-semibold mb-4">My cart</h1>
    <ul>
      <li v-for="(item, index) in cart" :key="index" class="flex items-center gap-4 p-2 border-b">
        <img :src="item.image" :alt="item.title" class="w-24 h-24 object-contain" />

        <div>{{ item.title }} - ${{ item.price.toFixed(2) }}</div>
      </li>
    </ul>
    <Button v-track:CART.click>Proceed to payment</Button>
  </div>
</template>
