<template>
  <q-form @submit.prevent="submit">
    <q-input v-model="form.username" label="Username" required />
    <q-input v-model="form.name" label="Name" required />
    <q-select
      :options="roles"
      option-label="name"
      option-value="id"
      v-model="form.role_id"
      label="Role"
      emit-value
    />
    <div class="text-right">
      <q-btn icon="save" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref, inject } from "vue";

const { api } = useUtil();
const roles = ref([]);
const bus = inject("bus");
const form = ref({
  name: "",
  username: "",
  role_id: null,
});
onMounted(() => {
  api(
    {
      method: "GET",
      url: "roles",
    },
    true
  ).then((response) => {
    roles.value = response.data.roles;
    form.value = {
      name: "",
      username: "",
      role_id: null,
    };
  });
});
const submit = () => {
  api({
    method: "POST",
    url: "users",
    data: {
      username: form.value.username,
      name: form.value.name,
      role_id: form.value.role_id,
    },
  }).then((response) => {
    bus.emit("userSubmitted", response.data.user);
  });
};
</script>
