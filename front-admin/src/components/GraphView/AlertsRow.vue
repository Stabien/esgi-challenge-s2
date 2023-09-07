<script setup>
import { defineProps, ref, defineEmits, inject } from 'vue';
import { useToast } from 'vue-toastification';

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
const toast = useToast();

const { tagsList } = inject('tagsList');
const props = defineProps(['alert', 'fetchAlerts', 'userGraphList']);
const isModalOpen = ref(false);
const alertClone = ref(props.alert);

const openModal = (isOpen) => (isModalOpen.value = isOpen);
const closeModal = () => {
  cancelChanges();
  isModalOpen.value = false;
};

const updateParentObject = (newObject) => {
  alertClone.value = newObject;
};

const cancelChanges = () => (alertClone.value = props.alert);
const isSame = () => {
  const keys1 = Object.keys(alertClone.value);
  const keys2 = Object.keys(props.alert);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (alertClone.value[key] !== props.alert[key]) {
      return false;
    }
  }

  return true;
};

const updateAlert = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/alerts/${alertClone.value.uuid}`, {
      method: 'PUT',
      body: JSON.stringify(alertClone.value),
      headers
    });
    props.fetchAlerts();

    toast('Alert updated succesfully');
    isModalOpen.value = false;
  } catch (error) {
    console.log(error);
  }
};
const deleteAlert = async () => {
  try {
    await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/alerts/${alertClone.value.uuid}`, {
      method: 'DELETE'
    });
    if (props.selectedUserGraphList.includes(props.graph)) {
      const newselectedUserGraphList = [...props.selectedUserGraphList].filter(
        (item) => item !== props.graph
      );

      emit('update:childSelectedGraph', newselectedUserGraphList);
    }
    props.fetchAlerts();
    toast('Alert delete successfully');
    isModalOpen.value = false;
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="relative mx-auto">
    <div
      :style="{
        gridTemplateColumns: `1fr auto`
      }"
      class="group grid gap-4 shadow-xl shadow-palette-primary-500"
    >
      <div class="text-start truncate w-[10rem]">
        {{ props.alert.name }}
      </div>
      <div
        @click.stop="openModal(!isModalOpen)"
        class="justify-center w-min flex rounded cursor-pointer items-center hover:bg-palette-primary-100 px-2 z-10"
      >
        <DotsIcon width="16" height="16" />
      </div>
    </div>
    <Modal :toggle="closeModal" v-show="isModalOpen" class="left-24 bg-white right-40 w-[500px]">
      <AlertsItem
        :userGraphList="props.userGraphList"
        :tagsList="tagsList"
        @update:childObject="updateParentObject"
        :alertSettings="alertClone"
      />

      <div class="grid grid-cols-3 gap-8">
        <Button type="button" size="sm" variant="destructive" @click="deleteAlert">Delete</Button>
        <div class="col-span-2 flex justify-end gap-2">
          <Button type="button" size="sm" variant="outline" v-if="!isSame()" @click="cancelChanges"
            >Cancel alert</Button
          >
          <Button type="button" size="sm" v-if="!isSame()" @click="updateAlert"
            >Update alert</Button
          >
        </div>
      </div>
    </Modal>
  </div>
  <hr class="w-[260px] mx-auto" />
</template>
