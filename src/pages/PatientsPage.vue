<template>
  <q-page padding v-if="pagination">
    <q-form @submit.prevent="submit" class="row items-center">
      <q-input
        label="Search"
        placeholder="Code"
        v-model="form.code"
        class="col"
        type="tel"
      />
      <div class="text-right">
        <q-btn icon="search" />
      </div>
    </q-form>
    <div class="q-my-xs">
      <q-btn
        icon="add"
        class="full-width"
        @click="
          $router.push({
            name: 'registerPatient',
          })
        "
      />
    </div>
    <div>
      <div class="text-center text-h6">Patients</div>
      <q-list bordered separator>
        <PatientListItem
          v-for="patient in pagination.data"
          :key="patient.id"
          :patient="patient"
        />
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import usePagination from "src/composables/pagination";
import PatientListItem from "src/components/PatientListItem";
import { ref } from "vue";

const submit = () => {
  console.log(form.value.code);
};
const form = ref({
  code: "",
});

const { pagination } = usePagination("patients");
</script>
