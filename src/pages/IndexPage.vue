<template>
  <q-page padding>
    <MenuActions v-if="userStore.getUser">Logout</MenuActions>
    <LoginForm v-else />
  </q-page>
</template>

<script setup>
import LoginForm from "src/components/LoginForm.vue";
import MenuActions from "src/components/MenuActions.vue";
import { useUserStore } from "src/stores/user-store";
const userStore = useUserStore();
</script>
