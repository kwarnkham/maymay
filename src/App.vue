<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeUnmount, inject } from "vue";
import useUtil from "./composables/util";
import { useUserStore } from "./stores/user-store";

const { initSocket } = useUtil();
const userStore = useUserStore();
const bus = inject("bus");
initSocket();

onMounted(() => {
  if (window.Echo)
    userStore.getUser.roles.forEach((role) => {
      if (role.name == "cashier") {
        window.Echo.private("visit").listen("VisitCreated", (data) => {
          bus.emit("visitCreated", data.visit);
          new Notification("New visit", {
            body: "Please add products and services",
            requireInteraction: true,
          });
        });
      }
    });
});

onBeforeUnmount(() => {
  if (window.Echo)
    userStore.getUser.roles.forEach((role) => {
      if (role.name == "cashier") {
        window.Echo.leave("visit");
      }
    });
});
</script>
