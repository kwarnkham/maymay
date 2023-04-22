<template>
  <q-page padding>
    <div class="text-center">
      <q-btn label="Create new type" no-caps @click="addNewVisitType" />
    </div>
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
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";

const visitTypes = ref([]);
const { api } = useUtil();
const { dialog } = useQuasar();
onMounted(() => {
  api({
    method: "GET",
    url: "visit-types",
  }).then((response) => {
    visitTypes.value = response.data.visit_types;
  });
});

const addNewVisitType = () => {
  dialog({
    title: "Create a new visit type",
    prompt: {
      model: "",
      isValid: (val) => val != "",
    },
    noBackdropDismiss: true,
    position: "top",
    cancel: true,
  }).onOk((val) => {
    api({
      method: "POST",
      url: "visit-types",
      data: {
        name: val,
      },
    }).then((response) => {
      visitTypes.value.push(response.data.visit_type);
    });
  });
};
</script>
