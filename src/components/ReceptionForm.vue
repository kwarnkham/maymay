<template>
  <q-form @submit.prevent="submit">
    <div class="text-center text-h6">Reception Form</div>
    <q-input label="Name" v-model="form.name" required autofocus />
    <q-input
      label="Age"
      v-model.number="form.age"
      required
      type="number"
      pattern="[0-9]*"
      inputmode="numeric"
    />
    <q-input label="Address" v-model="form.address" required />
    <q-input label="Phone" v-model="form.phone" required type="tel" />
    <div class="q-gutter-x-sm">
      <q-radio v-model="form.gender" :val="0" label="Male" />
      <q-radio v-model="form.gender" :val="1" label="Female" />
    </div>
    <div class="q-gutter-x-sm">
      <q-radio
        v-model="form.with_book_fees"
        :val="0"
        :label="$t('doNotAddBookFees')"
      />
      <q-radio
        v-model="form.with_book_fees"
        :val="1"
        :label="$t('addBookFees')"
      />
    </div>
    <div class="text-right q-mt-xs">
      <q-btn no-caps label="Submit" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { api } = useUtil();
const { notify } = useQuasar();
const { t } = useI18n();
const defaultFormData = {
  name: "",
  age: "",
  gender: 1,
  address: "",
  phone: "",
  with_book_fees: 1,
};
const form = ref(JSON.parse(JSON.stringify(defaultFormData)));

const submit = () => {
  api(
    {
      url: "patients",
      method: "POST",
      data: {
        name: form.value.name,
        age: form.value.age,
        gender: form.value.gender,
        address: form.value.address,
        phone: form.value.phone,
        with_book_fees: form.value.with_book_fees,
      },
    },
    true
  ).then(() => {
    notify({
      message: t("success"),
      type: "positive",
    });
    form.value = JSON.parse(JSON.stringify(defaultFormData));
  });
};
</script>
