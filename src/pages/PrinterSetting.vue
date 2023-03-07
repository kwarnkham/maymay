<template>
  <q-page padding>
    <div class="full-width q-px-lg">
      <div class="text-center text-subtitle1">
        This is size setting. Change this to adjust with the paper size
      </div>
      <q-badge color="primary"> Size: {{ printSize }} (1 to 10) </q-badge>
      <q-slider v-model="printSize" markers :min="1" :max="10" />
    </div>
    <q-separator spaced />
    <div class="full-width q-px-lg">
      <div class="text-center text-subtitle1">
        This is bit setting. Change this if the printer does not print or has
        error.
      </div>
      <q-badge color="accent"> Format: {{ printBit }} </q-badge>
      <q-slider v-model="printBit" markers :min="1" :max="5" color="accent" />
    </div>
    <q-separator spaced />
    <div>
      <q-input v-model="text" label="Test Text" />
      <q-file
        v-model="picture"
        label="Picture"
        :multiple="false"
        accept="image/*"
        clearable
      />
    </div>
    <div class="text-center q-mt-sm">
      <q-btn label="Test Print" no-caps @click="print" :disabled="printing" />
    </div>
    <div class="row justify-center full-width">
      <div class="text-grey-10" id="print-target" style="width: 360px">
        <div>{{ text }}</div>
        <img :src="displayImage" v-if="displayImage" width="360" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePrinter from "src/composables/printer";
import { ref, watch, computed } from "vue";

const { localStorage, notify } = useQuasar();
const { printBit, printSize, sendPrinterData } = usePrinter();
const printing = ref(false);
const text = ref("");
const picture = ref(null);
const reader = new FileReader();
const displayImage = ref(null);

reader.onload = () => {
  displayImage.value = reader.result;
};
watch(printSize, () => {
  localStorage.set("printSize", printSize.value);
});
watch(printBit, () => {
  localStorage.set("printBit", printBit.value);
});
watch(picture, () => {
  if (!picture.value) displayImage.value = null;
  else reader.readAsDataURL(picture.value);
});

const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"))
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
    });
};
</script>
