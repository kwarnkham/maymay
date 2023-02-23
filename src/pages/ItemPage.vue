<template>
  <q-page padding>
    <q-expansion-item
      expand-separator
      icon="add"
      :label="$t('addANewItem')"
      default-opened
    >
      <ItemForm />
    </q-expansion-item>
    <q-expansion-item
      expand-separator
      icon="menu"
      :label="$t('itemList')"
      default-opened
    >
      <ItemList />
    </q-expansion-item>
  </q-page>
</template>

<script setup>
import ItemForm from "src/components/ItemForm.vue";
import ItemList from "src/components/ItemList.vue";
</script>
