<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="bottom"
  >
    <q-card class="q-dialog-plugin">
      <q-form @submit.prevent="submit" class="q-pa-sm">
        <q-input
          :label="$t('description')"
          v-model="form.name"
          required
          dense
          autofocus
        />
        <q-input
          :label="$t('price')"
          v-model.number="form.price"
          required
          dense
          type="tel"
        />
        <q-input
          :label="$t('quantity')"
          v-model.number="form.quantity"
          required
          dense
          type="tel"
        />
        <q-card-actions align="right">
          <q-btn color="grey" :label="$t('cancel')" @click="onDialogCancel" />
          <q-btn color="primary" :label="$t('ok')" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";

// const props = defineProps({});
const form = ref({
  name: "",
  price: "",
  description: "",
});

const submit = () => {
  onDialogOK(form.value);
};
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
