<template>
  <q-page padding v-if="item" :style-fn="vhPage" class="column">
    <div class="text-center text-h5">{{ item.name }}</div>
    <p class="text-caption">{{ item.description }}</p>
    <div class="text-right">
      <q-btn icon="add" @click="showProductFormDialog" />
    </div>
    <div class="col column" v-if="pagination">
      <div>
        <q-input v-model="search" :label="$t('search')" />
      </div>
      <q-list bordered separator class="full-width col overflow-auto">
        <template v-for="product in pagination.data" :key="product.id">
          <q-item>
            <q-item-section>
              <q-item-label> {{ product.name }} </q-item-label>
              <q-item-label caption lines="2" v-if="product.description">
                {{ product.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      <app-pagination
        :pagination="pagination"
        v-model="current"
        :max="max"
        v-if="pagination"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import AppPagination from "src/components/AppPagination.vue";
import ProductFormDialog from "src/components/ProductFormDialog.vue";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const item = ref(null);
const { api, vhPage } = useUtil();
const route = useRoute();
const { dialog } = useQuasar;

const { pagination, current, max, fetch } = usePagination("products", {
  item_id: route.params.item,
});

const { search } = useSearchFilter({
  fetch,
  current,
  params: { item_id: route.params.item },
});
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
