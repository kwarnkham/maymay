<template>
  <div v-if="pagination" class="column no-wrap item-list">
    <div>
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="item in pagination.data" :key="item.id">
        <q-item>
          <q-item-section>
            <q-item-label> {{ item.name }} </q-item-label>
            <q-item-label caption lines="2" v-if="item.description">
              {{ item.description }}
            </q-item-label>
            <q-item-label class="row justify-around">
              <q-btn icon="add" @click="showProductFormDialog(item.id)" />
              <q-btn icon="edit" @click="showItemFormDialog(item)" />
              <q-btn icon="launch" />
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
import { debounce, useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPagination from "./AppPagination.vue";
import ItemFormDialog from "./ItemFormDialog.vue";
import ProductFormDialog from "./ProductFormDialog.vue";

const { pagination, fetch, current, max } = usePagination("items");

const route = useRoute();
const router = useRouter();
const search = ref(route.query.search ?? "");
const { dialog } = useQuasar();

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

const showProductFormDialog = (item_id) => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id,
    },
  });
};

const showItemFormDialog = (item) => {
  dialog({
    component: ItemFormDialog,
    componentProps: {
      item,
    },
  }).onOk((value) => {
    pagination.value.data.splice(
      pagination.value.data.findIndex((e) => e.id == value.id),
      1,
      value
    );
  });
};
</script>

<style scoped lang="scss">
.item-list {
  height: 500px;
}
</style>
