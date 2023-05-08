<template>
  <q-page padding>
    <div class="q-pa-sm q-gutter-y-sm shadow-2">
      <div class="text-center text-h6">Purchases Report</div>
      <q-input type="date" v-model="from" label="From" />
      <q-input type="date" v-model="to" label="To" />
      <div class="text-right">
        <q-btn label="Get report" @click="getPurchaseReport" no-caps />
      </div>
    </div>
    <div class="text-center q-mt-md">
      <q-btn label="Get Products Report" @click="getProductReport" no-caps />
    </div>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref } from "vue";
import { date, useQuasar } from "quasar";

const { formatDate } = date;
const { notify } = useQuasar();

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

const getPurchaseReport = () => {
  api({
    method: "GET",
    url: "purchases/report",
    params: {
      from: from.value,
      to: to.value,
    },
  }).then((response) => {
    if (response.data.data.length > 0)
      downloadCsv(
        toCsvString(response.data.data),
        `purchases reports from ${from.value} to ${to.value}`
      );
    else
      notify({
        message: "No data",
        type: "info",
      });
  });
};
const getProductReport = () => {
  api({
    method: "GET",
    url: "products/report",
  }).then((response) => {
    downloadCsv(toCsvString(response.data.data), "products reports");
  });
};

const toCsvString = (data) => {
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
