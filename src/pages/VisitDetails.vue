<template>
  <q-page padding v-if="visit">
    <div class="text-center text-h5">
      {{ visit.patient.code }}
    </div>
    <div class="text-subtitle1"># {{ visit.id }}</div>
    <div class="row justify-between">
      <div><q-icon name="person" /> {{ visit.patient.name }}</div>
      <div>
        {{ $t("age") }}: {{ visit.patient.age }}
        <q-icon
          :name="visit.patient.gender ? 'female' : 'male'"
          :color="visit.patient.gender ? 'accent' : 'primary'"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div><q-icon name="phone" /> {{ visit.patient.phone }}</div>
      <div><q-icon name="location_pin" /> {{ visit.patient.address }}</div>
    </div>
    <div class="q-my-xs row">
      <q-btn
        icon="add"
        class="col"
        v-if="![4, 5].includes(visit.status)"
        @click="showProductSearchingDialog"
      />
    </div>
    <q-markup-table separator="cell" flat bordered wrap-cells>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">{{ $t("name") }}</th>
          <th class="text-right">{{ $t("price") }}</th>
          <th class="text-right">{{ $t("qty") }}</th>
          <th class="text-right">{{ $t("amount") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, key) in visit.products" :key="product.id">
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">
            {{
              (
                product.pivot.sale_price - (product.pivot.discount ?? 0) ||
                "FOC"
              ).toLocaleString()
            }}
          </td>
          <td class="text-right">{{ product.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (
                (product.pivot.sale_price - (product.pivot.discount ?? 0)) *
                  product.pivot.quantity || "FOC"
              ).toLocaleString()
            }}
          </td>
        </tr>

        <tr
          v-for="(product, key) in cartStore.getProducts"
          :key="product.id"
          class="text-primary"
        >
          <td class="text-left">{{ key + 1 + visit.products.length }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">
            <span
              @click="applyDiscount(product)"
              :class="{ 'text-accent': product.discount }"
            >
              {{
                (
                  product.sale_price - (product.discount ?? 0) || "FOC"
                ).toLocaleString()
              }}
            </span>
          </td>
          <td class="text-right">{{ product.quantity }}</td>
          <td class="text-right">
            {{
              (
                (product.sale_price - (product.discount ?? 0)) *
                  product.quantity || "FOC"
              ).toLocaleString()
            }}
          </td>
        </tr>

        <tr>
          <td colspan="3" class="text-right">Total</td>
          <td class="text-right">
            {{
              visit.products.reduce(
                (carry, product) => carry + product.pivot.quantity,
                0
              ) +
              cartStore.getProducts.reduce(
                (carry, product) => carry + product.quantity,
                0
              )
            }}
          </td>
          <td class="text-right">
            {{
              (
                visit.products.reduce(
                  (carry, product) =>
                    carry +
                    (product.pivot.sale_price -
                      product.pivot.discount * product.pivot.quantity),
                  0
                ) +
                cartStore.getProducts.reduce(
                  (carry, product) =>
                    carry +
                    (product.sale_price - (product.discount ?? 0)) *
                      product.quantity,
                  0
                )
              ).toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Discount</td>
          <td class="text-right">
            {{ (visit.discount + cartStore.getCart.discount).toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Amount</td>
          <td class="text-right">
            {{
              (
                visit.amount +
                  cartStore.getProducts.reduce(
                    (carry, product) =>
                      carry +
                      (product.sale_price - (product.discount ?? 0)) *
                        product.quantity,
                    0
                  ) -
                  visit.discount -
                  cartStore.getCart.discount || "FOC"
              ).toLocaleString()
            }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductSearchingDialog from "src/components/ProductSearchingDialog.vue";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const cartStore = useCartStore();
const route = useRoute();
const { api } = useUtil();
const visit = ref(null);
const { dialog } = useQuasar();
const showProductSearchingDialog = () => {
  dialog({
    component: ProductSearchingDialog,
  });
};

const applyDiscount = (product) => {
  dialog({
    title: "Apply discount for " + product.name,
    message: "Normal sale price is " + product.sale_price,
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) => val <= product.sale_price,
      model: product.discount ? product.sale_price - product.discount : "",
    },
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((val) => {
    const discount = product.sale_price - val;

    cartStore.updateProduct({
      ...product,
      discount: discount > 0 ? discount : undefined,
    });
  });
};
onMounted(() => {
  api({
    method: "GET",
    url: "visits/" + route.params.visit,
  }).then((response) => {
    visit.value = response.data.visit;
  });
});
</script>
