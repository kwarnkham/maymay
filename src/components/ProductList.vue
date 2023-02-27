<template>
  <div v-if="pagination" class="column">
    <div class="q-my-xs">
      <q-input v-model="search" :label="$t('search')" />
      <q-input v-model="maxStock" :label="'Max Stock'" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="product in pagination.data" :key="product.id">
        <q-item
          clickable
          v-ripple
          :to="{
            name: 'product-details',
            params: {
              product: product.id,
            },
          }"
        >
          <q-item-section>
            <q-item-label> {{ product.name }} </q-item-label>
            <q-item-label caption lines="2" v-if="product.description">
              {{ product.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label>
              $: {{ product.sale_price.toLocaleString() }}
            </q-item-label>
            <q-item-label> stock :{{ product.stock }} </q-item-label>
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
</template>

<script setup>
import { debounce } from "quasar";
import AppPagination from "src/components/AppPagination.vue";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import { inject, onMounted, onBeforeUnmount, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  item_id: {
    type: [Number, String],
    required: false,
  },
});

const bus = inject("bus");
const maxStock = ref("");

const { pagination, current, max, fetch } = usePagination(
  "products",
  props.item_id
    ? {
        item_id: props.item_id,
      }
    : undefined
);

const { search } = useSearchFilter({
  fetch,
  current,
  params: props.item_id ? { item_id: props.item_id } : undefined,
});

const addProduct = (product) => {
  pagination.value.data.unshift(product);
};

const route = useRoute();
const router = useRouter();

watch(
  maxStock,
  debounce(() => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, max_stock: maxStock.value || undefined },
      })
      .then(() => {
        fetch(route.query);
      });
  }, 500)
);

onMounted(() => {
  bus.on("productFormSubmitted", addProduct);
});

onBeforeUnmount(() => {
  bus.off("productFormSubmitted", addProduct);
});
</script>
