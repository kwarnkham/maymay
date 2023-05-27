<template>
  <q-page padding>
    <div class="q-pa-sm q-gutter-y-sm shadow-2">
      <q-input type="date" v-model="from" label="From" />
      <q-input type="date" v-model="to" label="To" />
    </div>
    <div class="text-center q-mt-md row justify-around">
      <q-btn label="Products Report" @click="getProductReport" no-caps />
      <q-btn label="Purchases Report" @click="getPurchaseReport" no-caps />
      <q-btn label="Sales Report" @click="getSaleReport" no-caps />
      <q-btn label="Visit Report" @click="getVisitReport" no-caps />
    </div>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref } from "vue";
import { date, useQuasar } from "quasar";

const { formatDate } = date;
const { notify, dialog } = useQuasar();

const from = ref(
  formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    "YYYY-MM-DD"
  )
);

const to = ref(
  formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    "YYYY-MM-DD"
  )
);

const { api } = useUtil();

const getVisitReport = () => {
  api(
    {
      method: "GET",
      url: "visits",
      params: {
        statuses: "4",
        from: from.value,
        to: to.value,
      },
    },
    true
  ).then((response) => {
    downloadCsv(
      toCsvString(
        response.data.data.data.map((e) => {
          e.patient = e.patient.name;
          return e;
        })
      ),
      `visit reports from ${from.value} to ${to.value}`
    );
  });
};

const getPurchaseReport = () => {
  api(
    {
      method: "GET",
      url: "purchases/report",
      params: {
        from: from.value,
        to: to.value,
      },
    },
    true
  ).then((response) => {
    downloadCsv(
      toCsvString(response.data.data),
      `purchases reports from ${from.value} to ${to.value}`
    );
  });
};
const getProductReport = () => {
  dialog({
    title: "Choose date",
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
    prompt: {
      model: formatDate(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        "YYYY-MM-DD"
      ),
      type: "date",
      isValid: (v) => v != "",
    },
  }).onOk((date) => {
    api(
      {
        method: "GET",
        url: "products/report",
        params: {
          date,
        },
      },
      true
    ).then((response) => {
      downloadCsv(
        toCsvString(response.data.data),
        `products reports for ${date}`
      );
    });
  });
};

const getSaleReport = () => {
  api(
    {
      method: "GET",
      url: "visits/report",
      params: {
        from: from.value,
        to: to.value,
      },
    },
    true
  ).then((response) => {
    downloadCsv(
      toCsvString(response.data.data),
      `product sales reports from ${from.value} to ${to.value}`
    );
  });
};

const toCsvString = (data) => {
  if (!data[0]) return;
  const keys = Object.keys(data[0]);
  return [
    keys,
    ...data.map((item) =>
      keys.map((key) => `"${String(item[key]).replace(/"/g, '""')}"`)
    ),
  ]
    .map((e) => e.join(","))
    .join("\n");
};

const downloadCsv = (data, fileName) => {
  if (!data) {
    notify({
      message: "No data",
      type: "info",
    });
    return;
  }
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", fileName + ".csv");

  // Performing a download with click
  a.click();
};
</script>
