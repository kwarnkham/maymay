<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="top"
  >
    <q-card class="q-dialog-plugin q-pa-xs height">
      <div class="text-right">
        <q-btn icon="close" @click="onDialogCancel" flat />
      </div>
      <div class="q-px-lg">
        <q-input v-model.trim="search" :label="$t('search')" autofocus>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="row justify-around q-mt-sm q-gutter-y-sm">
        <q-btn
          :outline="
            cartStore.getProducts.findIndex((e) => e.id == product.id) != -1
          "
          :flat="
            cartStore.getProducts.findIndex((e) => e.id == product.id) == -1
          "
          :label="product.name"
          v-for="product in products"
          :key="product.id"
          no-caps
          :color="product.stock > 0 ? 'primary' : 'negative'"
          @click="addToCart(product)"
          :disabled="product.stock <= 0"
        >
          <q-badge floating>{{ product.stock }} </q-badge>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { debounce, useDialogPluginComponent, useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref, watch } from "vue";
import { useCartStore } from "src/stores/cart-store";

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const search = ref("");
const { api } = useUtil();
const products = ref([]);
const cartStore = useCartStore();
const { notify } = useQuasar();
watch(
  search,
  debounce(() => {
    if (search.value != "") {
      api({
        method: "GET",
        url: "products/search",
        params: {
          search: search.value,
          limit: 8,
        },
      }).then((response) => {
        products.value = response.data.products;
      });
    }
  }, 800)
);

const addToCart = (product) => {
  const addedQuantity = cartStore.getProducts.find(
    (e) => e.id == product.id
  )?.quantity;

  if (addedQuantity && addedQuantity + 1 > product.stock) {
    notify({
      message: "No enough stock",
      type: "warning",
    });
    return;
  }
  cartStore.addProduct({ product, quantity: 1 });
};
</script>

<style scoped lang="scss">
.height {
  min-height: 600px;
}
</style>
