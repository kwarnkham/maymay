<template>
  <div class="row justify-around q-gutter-y-xs">
    <q-card
      v-for="menu in menus"
      :key="menu.name"
      v-ripple
      class="cursor-pointer"
      @click="
        $router.push({
          name: menu.route,
        })
      "
    >
      <q-card-section>
        {{ menu.name }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
let menus = [
  {
    name: "Patients",
    route: "patients",
    roles: ["receptionist", "admin"],
  },
  {
    name: "Visits",
    route: "visits",
    roles: ["cashier", "admin", "pharmacist"],
  },
  {
    name: "Item",
    route: "items",
    roles: ["admin"],
  },
  {
    name: "Product",
    route: "products",
    roles: ["admin"],
  },
  {
    name: "User",
    route: "users",
    roles: ["admin"],
  },
  {
    name: "Change Password",
    route: "change-password",
  },
  {
    name: "Printer Setting",
    route: "printer-setting",
  },
  {
    name: "Logout",
    route: "logout",
  },
];

menus = menus.filter((e) => {
  if (!e.roles) return true;
  else {
    const temp = userStore.getUser.roles.filter((r) =>
      e.roles.includes(r.name)
    );
    // console.log(e.roles);
    // console.log(userStore.getUser.roles.map((e) => e.name));
    // console.log(temp);
    return temp.length > 0;
  }
});
</script>
