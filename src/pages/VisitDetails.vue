<template>
  <q-page padding v-if="visit" :key="$route.fullPath">
    <div>
      <div class="row q-gutter-x-sm q-py-sm">
        <q-badge
          class="q-px-md q-py-xs cursor-pointer"
          v-for="visitType in visitTypes"
          :key="visitType.id"
          @click="toggleType(visitType)"
          :color="
            visit.visit_types.map((e) => e.id).includes(visitType.id)
              ? 'green'
              : 'grey'
          "
        >
          {{ visitType.name }}
        </q-badge>
      </div>
    </div>
    <div
      id="print-target"
      class="bg-transparent text-grey-10"
      :style="{ width: printing ? '360px' : undefined }"
    >
      <div class="text-center text-h5">
        {{ visit.patient?.code }}
      </div>
      <div class="row text-body1 justify-between">
        <div># {{ visit.id }}</div>
        <div v-if="!printing">
          Status: {{ visitStatusToString(visit.status) }}
        </div>
        <div class="text-grey-10" v-else>
          {{ new Date().toLocaleString("en-GB", { hour12: true }) }}
        </div>
      </div>
      <div class="row justify-between text-body1">
        <div>
          {{ visit.patient.name }}
        </div>
        <div>
          {{ $t("age") }}: {{ visit.patient.age }}
          <q-icon
            :name="visit.patient.gender ? 'female' : 'male'"
            :color="visit.patient.gender ? 'accent' : 'primary'"
            size="1.3em"
          />
        </div>
      </div>
      <div class="row justify-between text-body1">
        <div>
          {{ visit.patient.phone }}
        </div>
        <div>
          <q-icon name="location_pin" size="1.3em" />
          {{ visit.patient.address }}
        </div>
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
        class="bg-transparent text-grey-10"
        separator="cell"
        flat
        bordered
        dense
        wrap-cells
        v-if="products.length"
        :class="[printing ? 'small-text' : 'normal-text']"
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
              <span
                @click="removeFromVisit(product)"
                class="inline-block"
                :class="{ 'ellipsis-text': printing }"
              >
                {{ product.name }}
              </span>
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
            <td class="text-right" colspan="3">Discount</td>
            <td class="text-right" colspan="2">
              <span @click="applyVisitDiscount">
                {{ discount.toLocaleString() }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="text-right" colspan="3">Amount</td>
            <td
              class="text-right"
              colspan="2"
              style="font-size: 18px !important"
            >
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

      <div class="q-pa-xs text-center q-mb-xl" v-if="printing">
        <div class="inline-block text-overline">------- Thank you -------</div>
      </div>
    </div>
    <div class="text-center q-mt-xs q-gutter-x-sm" v-if="visit.status == 4">
      <q-btn
        icon="print"
        @click="printReceipt"
        color="primary"
        :disabled="printing"
      />
      <q-btn
        icon="cancel"
        @click="addProductsToVisit(5)"
        color="warning"
        v-if="visit.status != 4 || stringRoles.includes('admin')"
      />
    </div>

    <div
      class="row justify-around q-mt-xs"
      v-if="![4, 5].includes(visit.status)"
    >
      <template
        v-if="stringRoles.includes('admin') || stringRoles.includes('cashier')"
      >
        <q-btn
          icon="save"
          @click="
            addProductsToVisit(products.every((e) => e.item_id == 1) ? 3 : 2)
          "
          v-if="products.length > 0 && isCart"
        />
        <q-btn
          icon="point_of_sale"
          @click="addProductsToVisit(4)"
          v-if="visit.status == 3 && !isCart"
          color="positive"
        />
      </template>
      <q-btn
        icon="local_post_office"
        @click="addProductsToVisit(3)"
        :disabled="!allChecked"
        v-if="
          (stringRoles.includes('admin') ||
            stringRoles.includes('pharmacist')) &&
          allChecked &&
          products.length > 0
        "
      />
      <q-btn
        icon="cancel"
        @click="addProductsToVisit(5)"
        color="warning"
        v-if="visit.status != 4 || stringRoles.includes('admin')"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import ProductSearchingDialog from "src/components/dialogs/ProductSearchingDialog.vue";
import useApp from "src/composables/app";
import usePrinter from "src/composables/printer";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { inject, onMounted, ref, onBeforeUnmount, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { sendPrinterData, sendTextData } = usePrinter();
const { api } = useUtil();
const { visitStatusToString } = useApp();
const visit = ref(null);
const { dialog, notify, loading } = useQuasar();
const bus = inject("bus");
const products = ref([]);
const discount = ref(0);
const { t } = useI18n();
const packedProducts = ref([]);
const visitTypes = ref([]);

const stringRoles = computed(() => userStore.getUser.roles.map((e) => e.name));
const allChecked = computed(() => {
  let result = true;
  products.value.forEach((product) => {
    result = packedProducts.value.includes(product.id);
  });
  return result;
});

const isCart = computed(
  () =>
    products.value.filter((e) => e.isCart).length > 0 ||
    products.value.length != visit.value.products.length
);

const showProductSearchingDialog = () => {
  dialog({
    component: ProductSearchingDialog,
    componentProps: {
      products: products.value,
    },
  });
};
const printing = ref(false);
const printReceipt = () => {
  printing.value = true;
  setTimeout(() => {
    sendPrinterData(document.getElementById("print-target")).finally(() => {
      sendTextData("").finally(() => {
        printing.value = false;
        loading.hide();
      });
    });
  }, 1000);
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
      products.value.findIndex((e) => e.id == product.id),
      1
    );
  });
};

const toggleType = (visitType) => {
  dialog({
    title: "Confirm",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    if (!visit.value.visit_types.map((e) => e.id).includes(visitType.id)) {
      dialog({
        title: "Choose date to start from",
        cancel: true,
        position: "top",
        noBackdropDismiss: true,
        prompt: {
          model: "",
          type: "date",
          isValid: (val) => !!val,
        },
      }).onOk((from) => {
        api({
          method: "POST",
          url: `visits/${route.params.visit}/toggle-type`,
          data: {
            visit_type_id: visitType.id,
            from,
          },
        }).then((response) => {
          visit.value = response.data.visit;
        });
      });
    } else {
      api({
        method: "POST",
        url: `visits/${route.params.visit}/toggle-type`,
        data: {
          visit_type_id: visitType.id,
        },
      }).then((response) => {
        visit.value = response.data.visit;
      });
    }
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
  if (!stringRoles.value.includes("cashier")) return;
  if (!stringRoles.value.includes("admin") && product.item_id != 1) return;
  dialog({
    title: "Apply discount for " + product.name,
    message: "Normal sale price is " + product.sale_price,
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) =>
        val >= 0 && (product.item_id != 1 ? val <= product.sale_price : true),
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
      discount: discount ?? undefined,
      isCart:
        discount !=
        visit.value.products.find((e) => e.id == product.id)?.pivot.discount,
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
    position: "top",
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
        (product.item_id == 1
          ? true
          : val <=
            Number(product.stock) + Number(getVisitQuantity(product.id))) &&
        val > 0,
    },
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((value) => {
    product.quantity = Number(value);
    const found = visit.value.products.find((e) => e.id == product.id);
    if (found) product.isCart = product.quantity != found.pivot.quantity;
    products.value.splice(
      products.value.findIndex((e) => e.id == product.id),
      1,
      product
    );
  });
};

const addProductsToVisit = (status) => {
  if (visit.value.status == 5) return;
  if (visit.value.status == 4 && !stringRoles.value.includes("admin")) return;
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
    sale_price: product.pivot.sale_price,
  }));
  discount.value = visit.value.discount;
};
const updateVisit = (data) => {
  visit.value.status = data.status;
};

const fetchVisit = () => {
  api(
    {
      method: "GET",
      url: "visits/" + route.params.visit,
    },
    true
  ).then((response) => {
    visit.value = response.data.visit;
  });
};

watch(route, () => {
  fetchVisit();
});

onMounted(() => {
  api({
    method: "GET",
    url: "visit-types",
    params: {
      hasFollowUps: "1",
    },
  }).then((response) => {
    visitTypes.value = response.data.visit_types;
  });
  fetchVisit();
  bus.on("addToVisit", addToVisit);
  bus.on("visitConfirmed", updateVisit);
  bus.on("productAddedToVisit", fetchVisit);
});

onBeforeUnmount(() => {
  bus.off("addToVisit", addToVisit);
  bus.off("visitConfirmed", updateVisit);
  bus.off("productAddedToVisit", fetchVisit);
});
</script>

<style scoped lang="scss">
.normal-text {
  td,
  th {
    font-size: 18px !important;
  }
}

.small-text {
  td,
  th {
    font-size: 12px !important;
  }
}

.ellipsis-text {
  width: 10em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
