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
      <UserForm :user="user" @user-submitted="submitted" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import UserForm from "../UserForm.vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const submitted = (user) => {
  onDialogOK(user);
};
</script>
