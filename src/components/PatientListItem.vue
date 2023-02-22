<template>
  <q-item>
    <q-item-section avatar>
      <q-icon
        :color="patient.gender ? 'accent' : 'primary'"
        :name="patient.gender ? 'female' : 'male'"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ patient.name }}</q-item-label>
      <q-item-label caption>{{ patient.age }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-btn icon="inventory" no-caps dense @click="recordVisit()" />
    </q-item-section>
    <q-item-section>
      <q-btn icon="details" no-caps dense />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const recordVisit = () => {
  router.push({
    name: "record-visit",
    params: {
      patient: props.patient.id,
    },
  });
};
</script>
