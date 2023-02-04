<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="row items-center">
      <q-input
        label="Search"
        placeholder="Code"
        v-model="form.code"
        class="col"
        type="tel"
      />
      <div class="text-right">
        <q-btn icon="search" />
      </div>
    </q-form>
    <div>
      <div class="text-center text-h6">Patients</div>
      <q-list bordered separator>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="male" />
          </q-item-section>
          <q-item-section>
            <q-item-label>U Mya</q-item-label>
            <q-item-label caption>56</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-btn label="Record visit" no-caps />
          </q-item-section>
          <q-item-section>
            <q-btn label="Details" no-caps />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const submit = () => {
  console.log(form.value.code);
};
const form = ref({
  code: "",
});
</script>
