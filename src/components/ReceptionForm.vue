<template>
  <q-form @submit.prevent="submit">
    <div class="text-center text-h6">Reception Form</div>
    <q-input label="Name" v-model="form.name" required />
    <q-input label="Age" v-model.number="form.age" required type="tel" />
    <q-input label="Address" v-model.number="form.age" required />
    <q-input label="Phone" v-model.number="form.age" required type="tel" />
    <div class="q-gutter-x-sm">
      <q-radio v-model="form.gender" val="male" label="Male" />
      <q-radio v-model="form.gender" val="female" label="Female" />
    </div>
    <div class="text-right q-mt-xs">
      <q-btn
        no-caps
        label="Submit"
        @click="
          $router.push({
            name: 'record-visit',
            params: {
              patient: 1,
            },
          })
        "
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  age: "",
  gender: "male",
  address: "",
  phone: "",
});

const submit = () => {};
</script>
