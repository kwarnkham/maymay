<template>
  <q-page padding>
    <q-list>
      <q-item
        v-for="visitType in visitTypes"
        :key="visitType.id"
        clickable
        @click="
          $router.push({
            name: 'visit-type-details',
            params: {
              visitType: visitType.id,
            },
          })
        "
      >
        <q-item-section>
          <q-item-label>
            {{ visitType.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";

const visitTypes = ref([]);
const { api } = useUtil();
onMounted(() => {
  api({
    method: "GET",
    url: "visit-types",
  }).then((response) => {
    visitTypes.value = response.data.visit_types;
  });
});
</script>
