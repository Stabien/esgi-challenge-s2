<script setup>
import { teamList } from '@/utils/constant'
</script>

<template>
  <main class="mx-auto w-10/12 lg:w-4/6 text-soft-black dark:text-soft-white">
    <section class="mb-8">
      <h1 class="text-3xl font-bold mb-4 text-palette-primary-500">About Virtual World</h1>
      <p class="text-lg mb-2">
        Welcome to Virtual World, your ultimate destination for the latest news and insights on
        technology, virtual reality, and the ever-expanding world of digital experiences.
      </p>
      <p class="text-lg mb-2">
        At Virtual World, we are passionate about exploring the frontiers of virtual reality,
        augmented reality, and other immersive technologies. Our mission is to bring you in-depth
        analysis, expert opinions, and exciting discoveries from the virtual realm.
      </p>
      <p class="text-lg mb-2">
        Our team of dedicated writers and tech enthusiasts is committed to delivering
        thought-provoking articles and updates about the ever-evolving landscape of digital
        experiences. From the latest VR gaming trends to cutting-edge AR applications, Virtual World
        has it all covered.
      </p>
      <p class="text-lg mb-2">
        Join us on this thrilling journey as we dive into the wonders of the virtual world and
        unveil the possibilities that lie ahead. Whether you are a seasoned tech enthusiast or just
        curious about the future of digital realities, Virtual World is your ultimate source for
        staying informed and inspired.
      </p>
      <p class="text-lg">
        Stay connected with us through our blog and social media channels as we embark on this
        adventure together. Let's explore the fascinating world of technology and virtual reality!
      </p>
    </section>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4 text-palette-primary-500">The team</h1>
      <section class="flex flex-wrap items-center justify-center gap-4 w-full lg:justify-between">
        <article
          v-for="(item, index) in teamList"
          :key="index"
          class="flex items-start gap-4 w-fit"
        >
          <img
            :src="`/users/${item.name}.png`"
            :alt="item.alt"
            class="aspect-square h-40 object-cover"
          />
          <div class="">
            <span class="text-sm">{{ item.date }}</span>
            <p class="font-bold mt-4 text-3xl">
              {{ item.name }}
            </p>
            <p class="text-palette-primary-500">{{ item.role }}</p>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>
