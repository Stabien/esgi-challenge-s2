<script setup>
import Link from '@/components/ui/Link.vue';
</script>

<template>
  <main class="relative h-screen mx-auto">
    <h1
      class="absolute text-palette-primary-100 text-[15rem] z-10 select-none -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2"
    >
      404
    </h1>
    <section
      class="bg-opacity-50 w-full absolute z-20 gap-10 flex flex-col items-center -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2"
    >
      <img class="h-20" src="/world.svg" alt="" srcset="" />
      <article class="dark:text-palette-gray-200 text-3xl text-center font-bold">
        Oops, the page doesn't exist
      </article>
      <Link variant="link" to="/"> Back to home </Link>
    </section>
  </main>
</template>
