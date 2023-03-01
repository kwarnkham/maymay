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
        <q-item
          clickable
          v-ripple
          :to="{
            name: 'visit-details',
            params: {
              visit: visit.id,
            },
          }"
        >
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
            <div
              :class="{
                'text-negative': visit.status == 5,
                'text-positive': visit.status == 4,
                'text-accent': visit.status == 3,
                'text-info': visit.status == 2,
                'text-primary': visit.status == 1,
              }"
            >
              status : {{ visitStatusToString(visit.status) }}
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <AppPagination
      :pagination="pagination"
      :max="max"
      v-if="pagination"
      v-model="current"
    />
  </q-page>
</template>

<script setup>
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { ref, watch, computed, onMounted, onBeforeUnmount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "quasar";
import AppPagination from "src/components/AppPagination.vue";
import useApp from "src/composables/app";
import { useUserStore } from "src/stores/user-store";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { visitStatusToString } = useApp();
const bus = inject("bus");
const statuses = ref([
  { key: "1", name: "Pending", value: true },
  { key: "2", name: "Products Added", value: true },
  { key: "3", name: "Confirmed", value: true },
  { key: "4", name: "Completed", value: true },
  { key: "5", name: "Canceled", value: true },
]);
const stringRoles = userStore.getUser.roles.map((e) => e.name);
if (!stringRoles.includes("admin"))
  statuses.value = statuses.value.filter((e) => {
    if (stringRoles.includes("cashier")) {
      return ["1", "2", "3", "4"].includes(e.key);
    } else if (stringRoles.includes("pharmacist")) {
      return ["2", "3"].includes(e.key);
    }
  });
statuses.value.forEach((e) => {
  e.value = route.query.statuses?.includes(e.key) || false;
});

const statusesParam = computed(() =>
  statuses.value
    .filter((e) => e.value)
    .map((e) => e.key)
    .join(",")
);
if (statusesParam.value == "")
  statuses.value = statuses.value.map((e) => {
    e.value = true;
    return e;
  });
const { vhPage } = useUtil();
const { pagination, current, max, fetch } = usePagination("visits", {
  statuses: statusesParam.value || undefined,
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

const updateVisits = (visit) => {
  const index = pagination.value?.data.findIndex((e) => e.id == visit.id);
  if (index >= 0) pagination.value.data[index] = visit;
};

onMounted(() => {
  bus.on("visitCreated", updateVisits);
});

onBeforeUnmount(() => {
  bus.off("visitCreated", updateVisits);
});
</script>
