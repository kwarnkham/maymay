<template>
  <div v-if="pagination" class="column no-wrap item-list">
    <div>
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="item in pagination.data" :key="item.id">
        <q-item
          clickable
          v-ripple
          :to="{
            name: 'item-details',
            params: {
              item: item.id,
            },
          }"
        >
          <q-item-section>
            <q-item-label> {{ item.name }} </q-item-label>
            <q-item-label caption lines="2" v-if="item.description">
              {{ item.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <AppPagination
      :pagination="pagination"
      v-model="current"
      :max="max"
      v-if="pagination"
    />
  </div>
</template>

<script setup>
import { debounce } from "quasar";
import usePagination from "src/composables/pagination";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPagination from "./AppPagination.vue";

const { pagination, fetch, current, max } = usePagination("items");

const route = useRoute();
const router = useRouter();
const search = ref(route.query.search ?? "");

watch(
  search,
  debounce(() => {
    const options = {
      name: route.name,
      query: {},
    };
    if (search.value) options.query.search = search.value;
    router.replace(options).then(() => {
      if (current.value == 1) fetch(options.query);
      else current.value = 1;
    });
  }, 800)
);
</script>

<style scoped lang="scss">
.item-list {
  height: 500px;
}
</style>
