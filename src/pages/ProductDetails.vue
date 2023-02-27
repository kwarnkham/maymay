<template>
  <q-page padding v-if="product" class="column">
    <div class="text-center text-h6">
      {{ product.name }}
    </div>
    <p>Description : {{ product.description }}</p>
    <div class="row justify-between">
      <div>Sale price :{{ product.sale_price.toLocaleString() }}</div>
      <div v-if="product.last_purchase_price">
        Last purchase price : {{ product.last_purchase_price.toLocaleString() }}
      </div>
    </div>
    <div>Stock : {{ product.stock }}</div>
    <div class="row q-gutter-x-sm">
      <q-btn icon="add" class="col" @click="showProductPurchaseForm(product)" />
      <q-btn icon="edit" class="col" @click="showEditProductForm(product)" />
    </div>
    <PurchaseList
      v-if="showProductList"
      class="col"
      :purchasable_id="product.id"
      type="App\Models\Product"
      @product:updated="updateProduct"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductFormDialog from "src/components/ProductFormDialog.vue";
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

const showProductPurchaseForm = (productToBePurchased) => {
  dialog({
    component: ProductPurchaseFormDialog,
    componentProps: {
      product: productToBePurchased,
    },
  }).onOk((value) => {
    showProductList.value = false;
    product.value = value;
    setTimeout(() => {
      showProductList.value = true;
    }, 500);
  });
};

const showEditProductForm = (productToBeEdit) => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id: product.value.item_id,
      product: productToBeEdit,
    },
  }).onOk((value) => {
    product.value.name = value.name;
    product.value.description = value.description;
    product.value.sale_price = value.sale_price;
  });
};

const updateProduct = (value) => {
  product.value = value;
};
</script>
