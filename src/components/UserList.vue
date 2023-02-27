<template>
  <div v-if="pagination" class="column">
    <div class="q-my-xs">
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="user in pagination.data" :key="user.id">
        <q-item>
          <q-item-section>
            <q-item-label> {{ user.username }} </q-item-label>
            <q-item-label caption v-if="user.name">
              {{ user.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label class="q-gutter-x-xs text-right">
              <q-badge v-for="role in user.roles" :key="role">
                {{ role.name }}
              </q-badge>
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
</template>

<script setup>
import AppPagination from "src/components/AppPagination.vue";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import { inject, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  item_id: {
    type: [Number, String],
    required: false,
  },
});

const bus = inject("bus");

const { pagination, current, max, fetch } = usePagination("users");

const { search } = useSearchFilter({
  fetch,
  current,
});

const addUser = (user) => {
  pagination.value.data.unshift(user);
};

onMounted(() => {
  bus.on("userSubmitted", addUser);
});

onBeforeUnmount(() => {
  bus.off("userSubmitted", addUser);
});
</script>
