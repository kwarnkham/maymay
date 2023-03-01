<template>
  <q-page padding>
    <template v-if="userStore.getUser">
      <MenuActions />
      <q-btn
        @click="checkNotification"
        icon="notifications"
        :color="canSendNoti ? 'primary' : 'negative'"
      />
    </template>

    <LoginForm v-else />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import LoginForm from "src/components/LoginForm.vue";
import MenuActions from "src/components/MenuActions.vue";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
const userStore = useUserStore();

const { notify } = useQuasar();
const canSendNoti = ref(Notification.permission == "granted");
const checkNotification = () => {
  Notification.requestPermission().then((permission) => {
    if (permission != "granted")
      notify({
        message: "Permission to send notification is denied",
      });
    else {
      canSendNoti.value = true;
      const notification = new Notification(
        "Permission to send notification is granted",
        {
          body: "Please also turn on device notification for browser",
          icon: null,
          image: null,
        }
      );

      notification.addEventListener("click", (e) => {
        notification.close();
      });
    }
  });
};
</script>
