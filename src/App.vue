<template>
  <router-view />
</template>

<script setup>
import useUtil from "src/composables/util";
import useApp from "src/composables/app";

const { initSocket } = useUtil();
const { subscribeToServer } = useApp();

initSocket();
subscribeToServer();

// onBeforeUnmount(() => {
// if (window.Echo)
//   userStore.getUser.roles.forEach((role) => {
//     if (role.name == "cashier") {
//       window.Echo.leave("visit");
//     }
//   });
// });
</script>
