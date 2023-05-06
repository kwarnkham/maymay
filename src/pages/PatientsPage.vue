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
            name: 'register-patient',
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
          @deleted="removeFromList"
          @patientUpdated="updatePatient"
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

const removeFromList = (patientId) => {
  const index = pagination.value.data.findIndex((e) => e.id == patientId);
  pagination.value.data.splice(index, 1);
};

const updatePatient = (patient) => {
  console.log(patient);
  const index = pagination.value.data.findIndex((e) => e.id == patient.id);
  pagination.value.data[index] = patient;
};
</script>
