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
      <q-item-label caption>{{ patient.code }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-btn icon="inventory" no-caps dense @click="recordVisit(patient)" />
    </q-item-section>
    <q-item-section>
      <q-btn icon="details" no-caps dense />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});

const { dialog } = useQuasar();
const { t } = useI18n();
const { api } = useUtil();

const router = useRouter();
const goToVisit = (data) => {
  api({
    url: "visits",
    method: "POST",
    data,
  }).then((response) => {
    router.push({
      name: "visit-details",
      params: {
        visit: response.data.visit.id,
      },
    });
  });
};
const recordVisit = (patient) => {
  dialog({
    title: t("bookFees"),
    message: t("doYouWantToAddBookFees"),
    cancel: true,
    ok: {
      label: t("add"),
      noCaps: true,
    },
    cancel: {
      label: t("doNotAdd"),
      noCaps: true,
    },
  })
    .onOk(() => {
      goToVisit({ patient_id: patient.id, with_book_fees: 1 });
    })
    .onCancel(() => {
      goToVisit({ patient_id: patient.id, with_book_fees: 0 });
    });
};
</script>
