<script setup>
import { ref } from 'vue';
import { updateLocalStorage } from '@/utils';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
  society: '',
  url: ''
});
const kbis = ref();
const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;
const register = async () => {
  try {
    if (form.value.password !== form.value.confirmPassword)
      throw new Error("Password doesn't match");

    if (!regexUrl.test(form.value.url)) throw new Error('Url is not valid');
    const formData = new FormData();
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    formData.append('confirmPassword', form.value.confirmPassword);
    formData.append('societyName', form.value.society);
    formData.append('url', form.value.url);
    formData.append('firstname', form.value.firstname);
    formData.append('lastname', form.value.lastname);
    formData.append('kbis', kbis.value);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };

    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/user/registration`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');
    const data = await response.json();
    updateLocalStorage('token', data.token);
    toast('Your are now logged');
    router.push('/');
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
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
      'Firstname Lastname'
      'Society Url'
      'Kbis Kbis'
      'Password Password'
      'Confirm_password Confirm_password'
    'button button'
  `
    }"
    @submit.prevent="register"
    class="grid grid-cols-2 gap-4 w-full"
  >
    <Input dataCy="email" type="email" label="Email" v-model="form.email" required="true" />
    <Input
      dataCy="firstname"
      type="text"
      label="Firstname"
      v-model="form.firstname"
      required="true"
    />
    <Input dataCy="lastname" type="text" label="Lastname" v-model="form.lastname" required="true" />
    <Input dataCy="society" type="text" label="Society" v-model="form.society" required="true" />
    <Input dataCy="url" type="text" label="Url" v-model="form.url" required="true" />
    <Input
      dataCy="file"
      type="file"
      label="Kbis"
      @change="(event) => (kbis = event.target.files[0])"
      required="true"
    />
    <Input
      dataCy="password"
      type="password"
      label="Password"
      v-model="form.password"
      required="true"
    />
    <Input
      dataCy="confirmPassword"
      type="password"
      label="Confirm_password"
      v-model="form.confirmPassword"
      required="true"
    />

    <Button :style="{ gridArea: 'button' }" type="submit">Join</Button>
  </form>
</template>
