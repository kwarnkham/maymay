<template>
  <q-form @submit.prevent="submit">
    <div class="text-center text-h5">{{ user ? "Update" : "Create" }} User</div>
    <q-input v-model="form.username" label="Username" required />
    <q-input v-model="form.name" label="Name" required />
    <q-select
      v-if="!user"
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

const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
});
const emit = defineEmits(["userSubmitted"]);
const { api } = useUtil();
const roles = ref([]);
const bus = inject("bus");
const form = ref({
  name: props.user ? props.user.name : "",
  username: props.user ? props.user.username : "",
  role_id: null,
});
onMounted(() => {
  if (!props.user)
    api(
      {
        method: "GET",
        url: "roles",
      },
      true
    ).then((response) => {
      roles.value = response.data.roles;
    });
});
const submit = () => {
  const options = {
    method: "POST",
    url: "users",
    data: {
      username: form.value.username,
      name: form.value.name,
      role_id: form.value.role_id,
    },
  };

  if (props.user) {
    options.method = "PUT";
    options.data.role_id = undefined;
    options.url = `users/${props.user.id}`;
  }

  api(options, true).then((response) => {
    if (props.user) emit("userSubmitted", response.data.user);
    else bus.emit("userSubmitted", response.data.user);
    form.value = {
      name: "",
      username: "",
      role_id: null,
    };
  });
};
</script>
