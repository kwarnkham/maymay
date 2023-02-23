<template>
  <q-page padding v-if="product" class="column">
    <div class="text-center text-h6">
      {{ product.name }}
    </div>
    <p>{{ product.description }}</p>
    <div class="row justify-between">
      <div>{{ product.sale_price.toLocaleString() }}</div>
      <div v-if="product.last_purchase_price">
        {{ product.last_purchase_price.toLocaleString() }}
      </div>
    </div>
    <div>{{ product.stock }}</div>
    <div>
      <q-btn
        icon="add"
        class="full-width"
        @click="showProductPurchaseForm(product)"
      />
    </div>
    <PurchaseList
      v-if="showProductList"
      class="col"
      :purchasable_id="product.id"
      type="App\Models\Product"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductPurchaseFormDialog from "src/components/ProductPurchaseFormDialog.vue";
import PurchaseList from "src/components/PurchaseList.vue";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const { api } = useUtil();
const route = useRoute();
const product = ref(null);
const { dialog } = useQuasar();
const showProductList = ref(true);
onMounted(() => {
  api({
    method: "GET",
    url: "products/" + route.params.product,
  }).then((response) => {
    product.value = response.data.product;
  });
});

const showProductPurchaseForm = (product) => {
  showProductList.value = false;
  dialog({
    component: ProductPurchaseFormDialog,
    componentProps: {
      product,
    },
  }).onDismiss(() => {
    showProductList.value = true;
  });
};
</script>
