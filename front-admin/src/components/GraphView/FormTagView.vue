<script setup>
import { inject } from 'vue';

const { tags } = inject('tags'); 
const { user } = inject('user');
console.log("yoloooooooooooo");
console.log(user.value)
</script>

<template>
    t
<form class="flex flex-col gap-4 w-full">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Choisissez ce que vous voulez afficher</h1> 
    <select>
        <option v-for="tag in tags" :key="tag.uuid" :value="tag.uuid">
            {{ tag.name }}
        </option>
    </select>
</form>
</template>


<!--================================================================================================================================================================================================

A modifier 

-->