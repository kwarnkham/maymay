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
      <q-btn
        icon="book"
        no-caps
        dense
        @click="recordVisit(patient)"
        color="grey"
      />
    </q-item-section>
    <q-item-section>
      <q-btn
        icon="book"
        no-caps
        dense
        @click="recordVisit(patient, true)"
        color="primary"
      />
    </q-item-section>
    <q-item-section>
      <q-btn
        icon="delete"
        no-caps
        dense
        @click="deletePatient(patient)"
        color="negative"
      />
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

const { dialog, notify } = useQuasar();
const { t } = useI18n();
const { api } = useUtil();
const emit = defineEmits(["deleted"]);

const deletePatient = (patient) => {
  dialog({
    title: "Confirm",
    message: `Do you want to delete the patient, ${patient.name}?`,
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api(
      {
        url: "patients/" + patient.id,
        method: "DELETE",
      },
      true
    ).then(() => {
      emit("deleted", patient.id);
    });
  });
};
const recordVisit = (patient, with_book_fees) => {
  dialog({
    title: "Confirm",
    message: "Are you sure?",
    cancel: true,
    class: with_book_fees ? "bg-blue-2" : "",
    noBackdropDismiss: true,
    ok: {
      label: t("add"),
      noCaps: true,
    },
  }).onOk(() => {
    api({
      url: "visits",
      method: "POST",
      data: { patient_id: patient.id, with_book_fees },
    }).then(() => {
      notify({
        message: "Success",
        type: "positive",
      });
    });
  });
};
</script>
