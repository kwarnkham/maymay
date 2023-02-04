<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center q-mb-sm">
        <div class="col">
          <div class="text-h6"><q-icon name="person" /> U Mya</div>
          <div class="text-subtitle2"><q-icon name="male" /> Age : 50</div>
        </div>
        <div class="col text-right">
          <div><q-icon name="location_pin" /> 30th x 70th</div>
          <div><q-icon name="phone" />098845122</div>
        </div>
      </q-card-section>
    </q-card>
    <VisitOrderTable
      :processing="!!$route.query.processing"
      :checkout="!!$route.query.checkout"
    />
  </q-page>
</template>

<script setup>
import VisitOrderTable from "src/components/VisitOrderTable.vue";
</script>
