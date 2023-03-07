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
</script>
