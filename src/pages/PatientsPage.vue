<template>
  <q-page padding v-if="pagination">
    <div>
      <q-input label="Search" placeholder="Code" v-model="search" class="col" />
    </div>
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
import useSearchFilter from "src/composables/searchFilter";

const { pagination, current, fetch } = usePagination("patients");
const { search } = useSearchFilter({ current, fetch });
</script>
