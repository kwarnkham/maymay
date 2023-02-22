<template>
  <div></div>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const { api } = useUtil();
const router = useRouter();
const { localStorage, dialog } = useQuasar();
const userStore = useUserStore();

onMounted(() => {
  dialog({
    title: "Confirm",
    message: "Do you want to logout?",
    cancel: true,
    noBackdropDismiss: true,
  })
    .onOk(() => {
      api({
        url: "logout",
        method: "DELETE",
      }).finally(() => {
        localStorage.remove("token");
        userStore.setUser(null);
        router.replace({
          name: "index",
        });
      });
    })
    .onCancel(() => {
      router.go(-1);
    });
});
</script>
