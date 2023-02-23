<template>
  <q-page padding v-if="pagination" :style-fn="vhPage" class="column">
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

const { vhPage } = useUtil();
const { pagination, current, max } = usePagination("visits");
</script>
