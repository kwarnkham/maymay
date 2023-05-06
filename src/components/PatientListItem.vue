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
    <q-item-section>
      <q-btn icon="edit" no-caps dense @click="edit(patient)" color="info" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useI18n } from "vue-i18n";

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});

const { dialog, notify } = useQuasar();
const { t } = useI18n();
const { api } = useUtil();
const emit = defineEmits(["deleted", "patientUpdated"]);

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

const edit = (patient) => {
  patient = JSON.parse(JSON.stringify(patient));
  dialog({
    title: "Choose options",
    cancel: true,
    noBackdropDismiss: true,
    options: {
      type: "radio",
      model: "name",
      items: [
        { label: "Name", value: "name" },
        { label: "Age", value: "age" },
        { label: "Gender", value: "gender" },
        { label: "Address", value: "address" },
        { label: "Phone", value: "phone" },
      ],
    },
  }).onOk((val) => {
    const prompt = {
      model: patient[val],
      type: ["age", "phone"].includes(val) ? "tel" : "text",
      isValid: (v) => v != "",
    };
    if (val != "gender")
      dialog({
        title: "Edit " + val,
        prompt,
        cancel: true,
        noBackdropDismiss: true,
      }).onOk((value) => {
        if (value != patient[val]) {
          patient[val] = value;
          updatePatient(patient, patient.id);
        }
      });
    else if (val == "gender")
      dialog({
        title: "Edit gender" + patient[val],
        noBackdropDismiss: true,
        cancel: true,
        options: {
          type: "radio",
          model: patient[val],
          items: [
            { label: "Male", value: 0, color: "primary" },
            { label: "Female", value: 1, color: "accent" },
          ],
        },
      }).onOk((value) => {
        if (patient[val] != value) {
          patient[val] = value;
          updatePatient(patient, patient.id);
        }
      });
  });
};
const updatePatient = (data, patient) => {
  api(
    {
      method: "PUT",
      url: `patients/${patient}`,
      data,
    },
    true
  ).then((response) => {
    emit("patientUpdated", response.data.patient);
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
