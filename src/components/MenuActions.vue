<template>
  <div class="row justify-around">
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
const menus = [
  {
    name: "Logout",
    route: "logout",
  },
  {
    name: "Patients",
    route: "patients",
  },
  {
    name: "Visits",
    route: "visits",
  },
  {
    name: "Item",
    route: "item",
  },
];
</script>
