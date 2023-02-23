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
          {{ $t("editItem") }}
        </div>
        <q-input v-model="formData.name" required :label="$t('name')" />
        <q-input
          v-model="formData.description"
          type="textarea"
          :label="$t('description')"
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
  item: {
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
      method: "PUT",
      url: "items/" + props.item.id,
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
    onDialogOK(response.data.item);
  });
};
const formData = ref({
  name: props.item.name,
  description: props.item.description,
});
</script>
