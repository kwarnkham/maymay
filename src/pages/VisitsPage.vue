<template>
  <q-page padding v-if="pagination" :style-fn="vhPage" class="column">
    <div class="row justify-evenly">
      <q-checkbox
        v-model="status.value"
        :label="status.name"
        v-for="status in statuses"
        :key="status.key"
      />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="visit in pagination.data" :key="visit.id">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>
              <q-icon name="person" /> {{ visit.patient.name }}
              <q-icon :name="visit.patient.gender ? 'female' : 'male'" />
            </q-item-label>
            <q-item-label caption>{{ visit.patient.age }} </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              {{
                new Date(visit.updated_at).toLocaleString("en-GB", {
                  hour12: true,
                })
              }}
            </q-item-label>
            <div># {{ visit.id }}</div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </q-page>
</template>

<script setup>
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "quasar";

const route = useRoute();
const router = useRouter();

const statuses = ref([
  { key: "1", name: "Pending", value: false },
  { key: "2", name: "Products Added", value: false },
  { key: "3", name: "Confirmed", value: false },
  { key: "4", name: "Completed", value: false },
  { key: "5", name: "Canceled", value: false },
]);

statuses.value.forEach((e) => {
  if (route.query.statuses?.includes(e.key)) {
    e.value = true;
  }
});

if (!statuses.value.filter((e) => e.value).length)
  statuses.value[0].value = true;

const statusesParam = computed(() =>
  statuses.value
    .filter((e) => e.value)
    .map((e) => e.key)
    .join(",")
);
const { vhPage } = useUtil();
const { pagination, current, max, fetch } = usePagination("visits", {
  statuses: statusesParam.value,
});

watch(
  statuses,
  debounce((value) => {
    if (statusesParam.value) {
      const query = { statuses: statusesParam.value };
      if (route.query.statuses != statusesParam.value)
        router
          .replace({
            name: route.name,
            query,
          })
          .then(() => {
            if (current.value == 1) fetch(query);
            else current.value = 1;
          });
    } else {
      statuses.value = value.map((e) => {
        if (e.key == route.query.statuses) {
          e.value = true;
        }
        return e;
      });
    }
  }, 800),
  { deep: true }
);
</script>
