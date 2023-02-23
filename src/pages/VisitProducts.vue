<template>
  <q-page padding v-if="visit">
    <div class="text-center text-h5">
      {{ visit.patient.code }}
    </div>
    <div class="text-subtitle1"># {{ visit.id }}</div>
    <div class="row justify-between">
      <div><q-icon name="person" /> {{ visit.patient.name }}</div>
      <div>
        Age: {{ visit.patient.age }}
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
                (product.pivot.price - (product.pivot.discount ?? 0)) *
                  product.pivot.quantity || "FOC"
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
              )
            }}
          </td>
          <td class="text-right">
            {{
              visit.products
                .reduce(
                  (carry, product) =>
                    carry +
                    (product.pivot.sale_price -
                      product.pivot.discount * product.pivot.quantity),
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
            {{ visit.discount.toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Amount</td>
          <td class="text-right">
            {{ (visit.amount - visit.discount || "FOC").toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { api } = useUtil();
const visit = ref(null);
onMounted(() => {
  api({
    method: "GET",
    url: "visits/" + route.params.visit,
  }).then((response) => {
    visit.value = response.data.visit;
  });
});
</script>
