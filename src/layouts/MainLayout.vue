<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          round
          icon="keyboard_arrow_left"
          @click="$router.go(-1)"
          flat
          v-if="$route.name != 'index'"
        />
        <q-toolbar-title
          class="cursor-pointer"
          @click="
            $router.push({
              name: 'index',
            })
          "
        >
          May May
        </q-toolbar-title>

        <div>24hr specialist clinic</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>
