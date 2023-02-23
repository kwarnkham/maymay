<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="top"
  >
    <q-card class="q-dialog-plugin q-pa-xs">
      <div class="text-right">
        <q-btn icon="close" @click="onDialogCancel" flat />
      </div>
      <q-form @submit.prevent="submit">
        <div class="text-center text-h5">
          {{ $t("addANewProduct") }}
        </div>
        <q-input
          v-model="formData.name"
          required
          :label="$t('name')"
          autofocus
        />
        <q-input
          v-model="formData.description"
          type="textarea"
          :label="$t('description')"
        />
        <q-input
          v-model.number="formData.sale_price"
          required
          :label="$t('salePrice')"
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
        />
        <div class="text-right">
          <q-btn icon="save" type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  item_id: {
    type: Number,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { api } = useUtil();
const { notify } = useQuasar();
const { t } = useI18n();
const submit = () => {
  api(
    {
      method: "POST",
      url: "products",
      data: {
        name: formData.value.name,
        description: formData.value.description,
        sale_price: formData.value.sale_price,
        item_id: props.item_id,
      },
    },
    true
  ).then((response) => {
    notify({
      message: t("success"),
      type: "positive",
    });
    onDialogOK(response.data.product);
  });
};
const formData = ref({
  name: "",
  description: "",
  sale_price: "",
});
</script>
