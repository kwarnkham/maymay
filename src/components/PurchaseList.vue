<template>
  <div v-if="pagination" class="column">
    <div>
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="purchase in pagination.data" :key="purchase.id">
        <q-item>
          <q-item-section>
            <q-item-label>{{ purchase.purchasable.name }} </q-item-label>
            <q-item-label caption>
              {{ purchase.price }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            {{ purchase.quantity }}
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
import AppPagination from "src/components/AppPagination.vue";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";

const props = defineProps({
  purchasable_id: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const { pagination, current, max, fetch } = usePagination(
  "purchases",
  props.purchasable_id
    ? {
        purchasable_id: props.purchasable_id,
        purchasable_type: props.type,
      }
    : undefined
);

const { search } = useSearchFilter({
  fetch,
  current,
  params: props.purchasable_id
    ? { purchasable_id: props.purchasable_id, purchasable_type: props.type }
    : undefined,
});
</script>
