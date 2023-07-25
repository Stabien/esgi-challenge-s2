<script setup>
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const form = ref({
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  society: '',
  url: ''
});

const sub = () => {
  console.log(form.value);
};
</script>

<template>
  <h1
    class="text-palette-primary-500 xl:text-[4rem] dark:text-soft-white gap-4 text-[2rem] font-bold"
  >
    Join Virtual world
  </h1>
  <form
    :style="{
      gridTemplateAreas: `'Email Email'
    'Password Password'
    'Firstname Lastname'
    'Society Url'
    'Kbis Kbis'
    'button button'
  `
    }"
    @submit.prevent="onSubmit"
    class="grid grid-cols-2 gap-4 w-full"
  >
    <Input type="email" required="true" label="Email" v-model="form.email" />
    <Input type="password" required="true" label="Password" v-model="form.password" />
    <Input type="text" label="Firstname" v-model="form.firstName" />
    <Input type="text" label="Lastname" v-model="form.lastname" />
    <Input type="text" label="Society" required="true" v-model="form.society" />
    <Input type="text" label="Url" required="true" v-model="form.url" />
    <Input type="file" label="Kbis" />

    <Button :style="{ gridArea: 'button' }" type="submit" @click="sub">Join</Button>
  </form>
</template>
