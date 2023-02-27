<template>
  <q-page padding>
    <q-form @submit.prevent="submit">
      <input
        :value="useStore.getUser.username"
        class="hidden"
        autocomplete="username"
      />
      <q-input
        v-model="form.password"
        label="Password"
        required
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
      />
      <q-input
        v-model="form.newPassword"
        label="New Password"
        required
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
      />
      <q-input
        v-model="form.newPasswordAgain"
        label="New Password Again"
        required
        :rules="[
          (val) => val == form.newPassword || 'New passwords do not match',
        ]"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
      />
      <q-checkbox v-model="showPassword" label="Show Password" />
      <div class="text-right">
        <q-btn icon="save" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";

const { api } = useUtil();
const { notify } = useQuasar();
const useStore = useUserStore();

const submit = () => {
  api(
    {
      method: "POST",
      url: "change-password",
      data: {
        password: form.value.password,
        new_password: form.value.newPassword,
        new_password_confirmation: form.value.newPasswordAgain,
      },
    },
    true
  ).then(() => {
    form.value.password = "";
    form.value.newPassword = "";
    form.value.newPasswordAgain = "";
    notify({
      message: "Success",
      type: "positive",
    });
  });
};

const showPassword = ref(false);
const form = ref({
  password: "",
  newPassword: "",
  newPasswordAgain: "",
});
</script>
