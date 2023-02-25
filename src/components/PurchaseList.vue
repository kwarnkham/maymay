<template>
  <div v-if="pagination" class="column">
    <div>
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="purchase in pagination.data" :key="purchase.id">
        <q-item
          clickable
          v-ripple
          @click="cancelPurchase(purchase)"
          :disable="purchase.status == 2 || purchase.stock != purchase.quantity"
          :class="{ 'bg-black text-white': purchase.status == 2 }"
        >
          <q-item-section>
            <q-item-label>
              {{ purchase.purchasable.name }} #{{ purchase.id }}
            </q-item-label>
            <q-item-label caption> Price :{{ purchase.price }} </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label>Qty: {{ purchase.quantity }} </q-item-label>
            <q-item-label>Stock: {{ purchase.stock }} </q-item-label>
            <q-item-label v-if="purchase.expired_on">
              {{ new Date(purchase.expired_on).toLocaleDateString("en-GB") }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <app-pagination
      :pagination="pagination"
      v-model="current"
      :max="max"
      v-if="pagination"
    />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import AppPagination from "src/components/AppPagination.vue";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";

const props = defineProps({
  purchasable_id: {
    type: [Number, String],
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["product:updated"]);

const { dialog } = useQuasar();
const { api } = useUtil();

const { pagination, current, max, fetch } = usePagination(
  "purchases",
  props.purchasable_id
    ? {
        purchasable_id: props.purchasable_id,
        purchasable_type: props.type,
      }
    : undefined
);

const cancelPurchase = (purchase) => {
  dialog({
    title: "Confirm",
    message: `Do you want to cancel the purchase, #${purchase.id}?`,
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `purchases/${purchase.id}/cancel`,
    }).then((response) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == response.data.purchase.id
      );
      pagination.value.data[index] = response.data.purchase;
      emit("product:updated", response.data.purchase.purchasable);
    });
  });
};

const { search } = useSearchFilter({
  fetch,
  current,
  params: props.purchasable_id
    ? { purchasable_id: props.purchasable_id, purchasable_type: props.type }
    : undefined,
});
</script>
