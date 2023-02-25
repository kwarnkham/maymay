<template>
  <q-form @submit.prevent="submit">
    <q-input v-model="formData.name" required :label="$t('name')" autofocus />
    <q-input
      v-model="formData.description"
      :label="$t('description')"
      type="textarea"
    />
    <div class="text-right q-my-xs">
      <q-btn icon="save" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref, inject } from "vue";
import { useI18n } from "vue-i18n";

const { notify } = useQuasar();
const bus = inject("bus");
const formData = ref({
  name: "",
  description: "",
});
const { api } = useUtil();
const { t } = useI18n();
const submit = () => {
  api(
    {
      method: "POST",
      url: "items",
      data: {
        name: formData.value.name,
        description: formData.value.description,
      },
    },
    true
  ).then((response) => {
    notify({
      message: t("success"),
      type: "positive",
    });
    formData.value = {
      name: "",
      description: "",
    };
    bus.emit("itemAdded", response.data.item);
  });
};
</script>
