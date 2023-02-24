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
    <q-markup-table
      separator="cell"
      flat
      bordered
      wrap-cells
      v-if="products.length"
    >
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
        <tr v-for="(product, key) in products" :key="product.id">
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">
            <span @click="removeFromVisit(product)">{{ product.name }}</span>
          </td>
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
              products.reduce((carry, product) => carry + product.quantity, 0)
            }}
          </td>
          <td class="text-right">
            {{
              products
                .reduce(
                  (carry, product) =>
                    carry +
                    (product.sale_price - (product.discount ?? 0)) *
                      product.quantity,
                  0
                )
                .toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Discount</td>
          <td class="text-right">
            {{ discount.toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Amount</td>
          <td class="text-right">
            {{
              (
                products.reduce(
                  (carry, product) =>
                    carry +
                    (product.sale_price - (product.discount ?? 0)) *
                      product.quantity,
                  0
                ) - discount || "FOC"
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
import { inject, onMounted, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { api } = useUtil();
const visit = ref(null);
const { dialog, notify } = useQuasar();
const bus = inject("bus");
const products = ref([]);
const discount = ref(0);

const showProductSearchingDialog = () => {
  dialog({
    component: ProductSearchingDialog,
    componentProps: {
      products: products.value,
    },
  });
};

const removeFromVisit = (product) => {
  dialog({
    title: "Confirm",
    message: "Do you want to remove the product, " + product.name,
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    products.value.splice(
      products.value.findIndex((e) => e.id == product),
      1
    );
  });
};
const addToVisit = (product) => {
  const addedQuantity = products.value.find(
    (e) => e.id == product.id
  )?.quantity;

  if (addedQuantity && addedQuantity + 1 > product.stock) {
    notify({
      message: "No enough stock",
      type: "warning",
    });
    return;
  }
  const existed = products.value.findIndex((e) => e.id == product.id);
  if (existed == -1) products.value.push({ ...product, quantity: 1 });
  else products.value[existed].quantity += 1;
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
    const index = products.value.findIndex((e) => e.id == product.id);
    products.value[index] = {
      ...product,
      discount: discount > 0 ? discount : undefined,
    };
  });
};
onMounted(() => {
  api({
    method: "GET",
    url: "visits/" + route.params.visit,
  }).then((response) => {
    visit.value = response.data.visit;
    products.value = visit.value.products.map((product) => ({
      ...product,
      quantity: product.pivot.quantity,
      discount: product.pivot.discount,
    }));
  });

  bus.on("addToVisit", addToVisit);
});

onBeforeUnmount(() => {
  bus.off("addToVisit", addToVisit);
});
</script>
