<template>
  <router-view />
</template>

<script setup>
import useUtil from "./composables/util";

const { initSocket } = useUtil();
initSocket();
</script>
