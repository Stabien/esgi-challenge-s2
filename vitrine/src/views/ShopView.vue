<script setup>
import Button from '@/components/ui/Button.vue';
import Link from '@/components/ui/Link.vue';
import { ref, onMounted } from 'vue';
import {exportData} from "../utils/trackerUtils/handleEvents";
import {getURL} from "../utils/trackerUtils/handleUrl";

const itemList = ref([]);
const cart = ref([]);
const fetchItems = async () => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products`);
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    itemList.value = data;
  } catch (error) {
    console.log(error);
  }
};

const addToCart = (product) => {
  cart.value.push(product);
  updateLocalStorageCart();
};
const isInCart = (product) => {
  return cart.value.some((item) => item.id === product.id);
};
const removeFromCart = (product) => {
  const index = cart.value.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    cart.value.splice(index, 1);
    updateLocalStorageCart();
  }
};

const updateLocalStorageCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

onMounted(() => {
  fetchItems();
  // Load cart from localStorage on component mount
  if (localStorage.getItem('cart')) {
    cart.value = JSON.parse(localStorage.getItem('cart'));
  }

  exportData({
    appId: import.meta.env.VITE_TRACKER_APPID,
    event: 'print',
    url: getURL(),
    sessionId: window.localStorage.getItem("Session_ID"),
    timestamp: Date.now()
  })
});
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-semibold mb-4">
      Fake Shop

      <Link variant="ghost" to="/cart">See my cart</Link>
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="product in itemList"
        :key="product.id"
        class="bg-white p-4 shadow-md rounded-lg flex flex-col justify-between gap-4"
      >
        <div>
          <img :src="product.image" :alt="product.title" class="w-full h-40 object-contain" />
          <h3 class="text-lg font-semibold mt-2">{{ product.title }}</h3>
          <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>
          <div class="flex items-center mt-2">
            <span class="text-indigo-600 font-semibold">{{ product.rating.rate }}</span>
            <span class="text-gray-600 ml-1">({{ product.rating.count }} reviews)</span>
          </div>
        </div>
        <div>
          <Button
            v-track:SHOP.click
            variant="outline"
            v-if="isInCart(product)"
            @click="removeFromCart(product)"
            class="w-full bottom-0"
          >
            Remove from cart
          </Button>
          <Button v-track:SHOP.click v-else @click="addToCart(product)" class="w-full bottom-0">
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>
