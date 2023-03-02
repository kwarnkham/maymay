<template>
  <q-form @submit.prevent="submit">
    <div class="text-h5 text-center">Login</div>
    <q-input
      autofocus
      v-model="form.username"
      required
      autocomplete="username"
      placeholder="Username"
    />
    <q-input
      v-model="form.password"
      required
      type="password"
      autocomplete="current-password"
      placeholder="Password"
    />
    <div class="text-right q-mt-sm">
      <q-btn type="submit" label="Login" no-caps="" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { api as axios } from "src/boot/axios";

const { api, initSocket } = useUtil();
const { localStorage } = useQuasar();
const form = ref({
  username: "",
  password: "",
});
const userStore = useUserStore();

const submit = () => {
  api(
    {
      method: "POST",
      url: "login",
      data: {
        username: form.value.username,
        password: form.value.password,
      },
    },
    true
  ).then((response) => {
    localStorage.set("token", response.data.token);
    userStore.setUser(response.data.user);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + response.data.token;

    initSocket();
  });
};
</script>
