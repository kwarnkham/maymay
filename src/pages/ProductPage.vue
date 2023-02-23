<template>
  <q-page padding :style-fn="vhPage" class="column">
    <ProductList class="col" />
  </q-page>
</template>

<script setup>
import ProductList from "src/components/ProductList.vue";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();
</script>
