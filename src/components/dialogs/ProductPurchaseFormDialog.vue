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
          {{ $t("purchaseProduct") }} {{ product.name }}
        </div>
        <q-input
          :autofocus="!product.last_purchase_price"
          v-model.number="formData.price"
          required
          :label="$t('purchasedPrice')"
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
        />
        <q-input
          :autofocus="!!product.last_purchase_price"
          v-model.number="formData.quantity"
          required
          :label="$t('quantity')"
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
        />

        <div class="text-center">
          <q-date
            v-model="formData.expired_on"
            title="Expire Date"
            subtitle="Optional"
          />
        </div>
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
  product: {
    type: Object,
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
      url: `products/${props.product.id}/purchase`,
      data: {
        price: formData.value.price,
        quantity: formData.value.quantity,
        expired_on: formData.value.expired_on,
      },
    },
    true
  ).then((response) => {
    notify({
      message: t("success"),
      type: "positive",
    });
    onDialogOK(response.data.purchase.purchasable);
  });
};
const formData = ref({
  price: props.product.last_purchase_price ?? "",
  quantity: "",
  expired_on: null,
});
</script>
