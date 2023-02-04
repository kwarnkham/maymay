<template>
  <q-page padding>
    <div>
      <q-btn
        label="Search Patients"
        no-caps
        @click="
          $router.push({
            name: 'patients',
          })
        "
      />
    </div>
    <ReceptionForm />
  </q-page>
</template>

<script setup>
import ReceptionForm from "src/components/ReceptionForm.vue";
</script>
