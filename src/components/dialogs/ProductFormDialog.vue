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
          {{ product ? $t("editProductInfo") : $t("addANewProduct") }}
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
import { ref, inject } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  item_id: {
    type: [Number, String],
    required: true,
  },
  product: {
    type: Object,
    required: false,
  },
});

const bus = inject("bus");

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { api } = useUtil();
const { notify } = useQuasar();
const { t } = useI18n();
const submit = () => {
  const options = {
    method: "POST",
    url: "products",
    data: {
      name: formData.value.name,
      description: formData.value.description,
      sale_price: formData.value.sale_price,
      item_id: props.item_id,
    },
  };

  if (props.product) {
    options.method = "PUT";
    options.url = `products/${props.product.id}`;
  }

  api(options, true).then((response) => {
    notify({
      message: t("success"),
      type: "positive",
    });
    onDialogOK(response.data.product);
    bus.emit("productFormSubmitted", response.data.product);
  });
};
const formData = ref({
  name: props.product ? props.product.name : "",
  description: props.product ? props.product.description : "",
  sale_price: props.product ? props.product.sale_price : "",
});
</script>
