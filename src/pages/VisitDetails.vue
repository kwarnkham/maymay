<template>
  <q-page padding v-if="visit">
    <div class="text-center text-h5">
      {{ visit.patient.code }}
    </div>
    <div class="row justify-between">
      <div class="text-subtitle1"># {{ visit.id }}</div>
      <div class="text-subtitle1">
        Status: {{ visitStatusToString(visit.status) }}
      </div>
    </div>
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
        <tr
          v-for="(product, key) in products"
          :key="product.id"
          :class="{
            'bg-green-2': visit.status == 3 && !product.isCart,
            'bg-lime': packedProducts.includes(product.id),
          }"
        >
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
          <td class="text-right">
            <span @click="editQuanity(product)">{{ product.quantity }}</span>
          </td>
          <td class="text-right">
            <span @click="markAsPacked(product)">
              {{
                (
                  (product.sale_price - (product.discount ?? 0)) *
                    product.quantity || "FOC"
                ).toLocaleString()
              }}
            </span>
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
            <span @click="applyVisitDiscount">{{
              discount.toLocaleString()
            }}</span>
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
    <div
      class="row justify-around q-mt-xs"
      v-if="![4, 5].includes(visit.status)"
    >
      <template
        v-if="stringRoles.includes('admin') || stringRoles.includes('cashier')"
      >
        <q-btn icon="save" @click="addProductsToVisit(2)" />
        <q-btn
          icon="point_of_sale"
          @click="addProductsToVisit(4)"
          :disabled="visit.status != 3"
          color="positive"
        />
        <q-btn
          icon="cancel"
          @click="addProductsToVisit(5)"
          :disabled="visit.status == 4"
          color="warning"
        />
      </template>
      <q-btn
        icon="local_post_office"
        @click="addProductsToVisit(3)"
        :disabled="!allChecked"
        v-if="
          stringRoles.includes('admin') || stringRoles.includes('pharmacist')
        "
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductSearchingDialog from "src/components/ProductSearchingDialog.vue";
import useApp from "src/composables/app";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { inject, onMounted, ref, onBeforeUnmount, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const { api } = useUtil();
const { visitStatusToString } = useApp();
const visit = ref(null);
const { dialog, notify } = useQuasar();
const bus = inject("bus");
const products = ref([]);
const discount = ref(0);
const { t } = useI18n();
const packedProducts = ref([]);

const stringRoles = computed(() => userStore.getUser.roles.map((e) => e.name));
const allChecked = computed(() => {
  let result = true;
  products.value.forEach((product) => {
    result = packedProducts.value.includes(product.id);
  });
  return result;
});

const showProductSearchingDialog = () => {
  dialog({
    component: ProductSearchingDialog,
    componentProps: {
      products: products.value,
    },
  });
};

const removeFromVisit = (product) => {
  if ([4, 5].includes(visit.value.status)) return;
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
    if (product.item_id == 1)
      notify({
        message: `${product.name} is already added`,
        type: "info",
      });
    else
      notify({
        message: "No enough stock",
        type: "warning",
      });
    return;
  }
  const existed = products.value.findIndex((e) => e.id == product.id);
  product.isCart = true;
  if (existed == -1) products.value.push({ ...product, quantity: 1 });
  else {
    products.value[existed].quantity += 1;
    products.value[existed].isCart = true;
  }
};

const applyDiscount = (product) => {
  if ([4, 5].includes(visit.value.status)) return;
  if (!stringRoles.value.includes("admin")) return;
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
      isCart:
        discount !=
        visit.value.products.find((e) => e.id == product.id).pivot.discount,
    };
  });
};

const markAsPacked = (product) => {
  if ([4, 5].includes(visit.value.status)) return;
  if (
    !stringRoles.value.includes("pharmacist") &&
    !stringRoles.value.includes("admin")
  )
    return;
  const index = packedProducts.value.findIndex((e) => e == product.id);
  if (index >= 0) packedProducts.value.splice(index, 1);
  else packedProducts.value.push(product.id);
};

const getVisitQuantity = (product_id) => {
  return (
    visit.value.products.find((e) => e.id == product_id)?.pivot.quantity ?? 0
  );
};

const applyVisitDiscount = () => {
  if ([4, 5].includes(visit.value.status)) return;
  if (!stringRoles.value.includes("admin")) return;
  dialog({
    title: "Apply discount",
    message: `Discount for the whole visit`,
    prompt: {
      model: discount.value || "",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) =>
        val <=
          products.value.reduce(
            (carry, product) =>
              carry +
              (product.sale_price - (product.discount ?? 0)) * product.quantity,
            0
          ) && val >= 0,
    },
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((value) => {
    discount.value = value;
  });
};

const getStock = (product) => {
  return getVisitQuantity(product.id) + product.stock;
};

const editQuanity = (product) => {
  if ([4, 5].includes(visit.value.status)) return;
  if (
    !stringRoles.value.includes("admin") &&
    !stringRoles.value.includes("cashier")
  )
    return;
  dialog({
    title: "Edit quantity of " + product.name,
    message: `Stock ${getStock(product)}`,
    prompt: {
      model: product.quantity,
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) =>
        val <= Number(product.stock) + Number(getVisitQuantity(product.id)) &&
        val > 0,
    },
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((value) => {
    product.quantity = Number(value);

    product.isCart =
      product.quantity !=
      visit.value.products.find((e) => e.id == product.id).pivot.quantity;
    products.value.splice(
      products.value.findIndex((e) => e.id == product.id),
      1,
      product
    );
  });
};

const addProductsToVisit = (status) => {
  if ([4, 5].includes(visit.value.status)) return;
  dialog({
    title: "Confirm",
    message: "Are you sure?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api(
      {
        url: `visits/${route.params.visit}/products`,
        method: "POST",
        data: {
          products: status == 5 ? [] : products.value,
          discount: status == 5 ? 0 : discount.value,
          status,
        },
      },
      true
    ).then((response) => {
      visit.value = response.data.visit;

      packedProducts.value = [];
      notify({
        message: t("success"),
        type: "positive",
      });
    });
  });
};

watch(visit, () => {
  reassignProducts();
});

const reassignProducts = () => {
  products.value = visit.value.products.map((product) => ({
    ...product,
    quantity: product.pivot.quantity,
    discount: product.pivot.discount,
  }));
  discount.value = visit.value.discount;
};
const updateVisit = (data) => {
  visit.value = data;
};

onMounted(() => {
  api({
    method: "GET",
    url: "visits/" + route.params.visit,
  }).then((response) => {
    visit.value = response.data.visit;
  });

  bus.on("addToVisit", addToVisit);
  bus.on("visitCreated", updateVisit);
  bus.on("visitConfirmed", updateVisit);
  bus.on("productAddedToVisit", updateVisit);
});

onBeforeUnmount(() => {
  bus.off("addToVisit", addToVisit);
  bus.off("visitCreated", updateVisit);
  bus.off("visitConfirmed", updateVisit);
  bus.off("productAddedToVisit", updateVisit);
});
</script>
