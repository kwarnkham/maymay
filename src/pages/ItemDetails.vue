<template>
  <q-page padding v-if="item" :style-fn="vhPage" class="column">
    <div class="text-center text-h5">{{ item.name }}</div>
    <p class="text-caption">Description : {{ item.description }}</p>
    <div class="text-right">
      <q-btn icon="add" @click="showProductFormDialog" />
    </div>
    <ProductList class="col" :item_id="item.id" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductFormDialog from "src/components/ProductFormDialog.vue";
import ProductList from "src/components/ProductList.vue";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const item = ref(null);
const { api, vhPage } = useUtil();
const route = useRoute();
const { dialog } = useQuasar();

const showProductFormDialog = () => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id: route.params.item,
    },
  });
};
onMounted(() => {
  api({
    method: "GET",
    url: "items/" + route.params.item,
  }).then((response) => {
    item.value = response.data.item;
  });
});
</script>
