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
              <q-btn
                icon="launch"
                @click="
                  $router.push({
                    name: 'item-details',
                    params: {
                      item: item.id,
                    },
                  })
                "
              />
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
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import { inject, onMounted, onBeforeUnmount } from "vue";
import AppPagination from "./AppPagination.vue";
import ItemFormDialog from "./ItemFormDialog.vue";
import ProductFormDialog from "./ProductFormDialog.vue";

const { pagination, fetch, current, max } = usePagination("items");
const { search } = useSearchFilter({ current, fetch });

const { dialog } = useQuasar();
const bus = inject("bus");
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

const addItem = (item) => {
  pagination.value.data.unshift(item);
};

onMounted(() => {
  bus.on("itemAdded", addItem);
});

onBeforeUnmount(() => {
  bus.off("itemAdded", addItem);
});
</script>

<style scoped lang="scss">
.item-list {
  height: 500px;
}
</style>
