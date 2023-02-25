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
          :outline="products.findIndex((e) => e.id == product.id) != -1"
          :flat="products.findIndex((e) => e.id == product.id) == -1"
          :label="product.name"
          v-for="product in searchedProducts"
          :key="product.id"
          no-caps
          :color="product.stock > 0 ? 'primary' : 'negative'"
          @click="addToVisit(product)"
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
import { inject } from "vue";

const bus = inject("bus");
defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const search = ref("");
const { api } = useUtil();
const searchedProducts = ref([]);
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
        searchedProducts.value = response.data.products;
      });
    }
  }, 800)
);

const addToVisit = (product) => {
  bus.emit("addToVisit", product);
};
</script>

<style scoped lang="scss">
.height {
  min-height: 600px;
}
</style>
