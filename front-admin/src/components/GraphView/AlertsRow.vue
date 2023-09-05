<script setup>
import { defineProps, ref, defineEmits, inject } from 'vue';
import { useToast } from 'vue-toastification';

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
const toast = useToast();

const props = defineProps(['alert', 'fetchAlerts', 'userGraphList']);
const isModalOpen = ref(false);
const { tagsList } = inject('tagsList');

const alertClone = ref(props.alert);
console.log(alertClone.value.appId);
const openModal = (isOpen) => (isModalOpen.value = isOpen);
const closeModal = () => {
  cancelChanges();
  isModalOpen.value = false;
};

const updateParentObject = (newObject) => {
  alertClone.value = newObject;
};

const cancelChanges = () => (alertClone.value = props.graph);
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
  <div class="relative">
    <div class="group grid grid-cols-graph gap-4">
      <span class="text-start truncate">
        {{ props.alert.name }}
      </span>
      <div
        @click.stop="openModal(!isModalOpen)"
        class="hidden group-hover:inline-flex justify-center items-center hover:bg-palette-primary-100 px-2 relative"
      >
        <DotsIcon width="16" height="16" />
      </div>
    </div>
    <Modal :toggle="closeModal" v-if="isModalOpen" class="left-24 bg-white right-40 w-[500px]">
      <AlertsItem
        :userGraphList="props.userGraphList"
        :tagsList="tagsList"
        @update:childObject="updateParentObject"
        :alertSettings="alertClone"
      />

      <div class="grid grid-cols-3 gap-8">
        <Button size="sm" variant="destructive" @click="deleteAlert">Delete</Button>
        <div class="col-span-2 flex justify-end gap-2">
          <Button size="sm" variant="outline" v-if="!isSame()" @click="cancelChanges"
            >Cancel alert</Button
          >
          <Button size="sm" v-if="!isSame()" @click="updateAlert">Update alert</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
