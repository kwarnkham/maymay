<template>
  <q-markup-table separator="cell" bordered :dense="$q.screen.lt.sm">
    <thead>
      <tr v-if="creating">
        <th colspan="6" class="text-center">
          <q-btn icon="add" @click="showAddItemDialog" />
        </th>
      </tr>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">{{ $t("description") }}</th>
        <th class="text-right">{{ $t("price") }}</th>
        <th class="text-right">{{ $t("qty") }}</th>
        <th class="text-right">{{ $t("amount") }}</th>
        <th class="text-right" v-if="creating || processing">
          {{ $t("action") }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in items"
        :key="item.id"
        :class="{
          'bg-positive': item.isReady,
          'bg-negative': item.notAvailable,
        }"
      >
        <td class="text-left">{{ index + 1 }}</td>
        <td class="text-left">{{ item.name }}</td>
        <td class="text-right">{{ item.price || "FOC" }}</td>
        <td class="text-right">{{ item.quantity }}</td>
        <td class="text-right">{{ item.quantity * item.price || "FOC" }}</td>
        <td class="row justify-between" v-if="creating">
          <q-btn dense icon="add" />
          <q-btn dense icon="remove" />
          <q-btn dense icon="delete" />
        </td>
        <td class="row justify-between bg-white" v-if="processing">
          <q-btn
            dense
            :flat="item.isReady"
            icon="done"
            @click="toggleCheck(item)"
            :disabled="item.notAvailable"
          />
          <q-btn
            dense
            :flat="item.notAvailable"
            icon="cancel"
            @click="toggleAvailable(item)"
            :disabled="item.isReady"
          />
        </td>
      </tr>

      <tr>
        <td colspan="3" class="text-right">Total</td>
        <td class="text-right">
          {{ items?.reduce((carry, item) => carry + item.quantity, 0) }}
        </td>
        <td class="text-right">
          {{
            items?.reduce(
              (carry, item) => carry + item.quantity * item.price,
              0
            ) || "FOC"
          }}
        </td>
        <td class="text-center" v-if="creating">
          <q-btn dense icon="discount" />
        </td>
        <td class="text-center" v-if="processing">
          <q-btn
            dense
            icon="done_all"
            :disabled="items?.findIndex((e) => !e.checked) >= 0"
            @click="
              $router.push({
                name: 'visit-details',
                params: {
                  visit: 1,
                },
                query: {
                  checkout: '1',
                },
              })
            "
          />
        </td>
      </tr>
      <tr v-if="creating">
        <td colspan="6" class="text-right q-gutter-x-sm">
          <q-btn icon="clear" />
          <q-btn
            icon="post_add"
            @click="
              $router.push({
                name: 'visit-details',
                params: {
                  visit: 1,
                },
                query: {
                  processing: '1',
                },
              })
            "
          />
        </td>
      </tr>

      <tr v-if="checkout">
        <td colspan="6" class="text-right q-gutter-x-sm">
          <q-btn icon="point_of_sale" />
          <q-btn icon="print" />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
import AddItemDialog from "src/components/dialogs/AddItemDialog.vue";
import { useQuasar } from "quasar";
import { ref, watch } from "vue";

const { dialog, localStorage } = useQuasar();

const props = defineProps({
  creating: {
    type: Boolean,
    default: false,
  },
  processing: {
    type: Boolean,
    default: false,
  },
  checkout: {
    type: Boolean,
    default: false,
  },
});

//todo
const items = ref(localStorage.getItem(`1.visit`) ?? []);
if (props.processing) items.value = localStorage.getItem(`1.visit`) ?? [];
const preserveForm = () => {
  localStorage.set(`1.visit`, items.value);
};

watch(items, preserveForm, {
  deep: true,
});
const showAddItemDialog = () => {
  dialog({
    component: AddItemDialog,
  }).onOk((data) => {
    //todo
    items.value.push({ ...data, id: items.value.length + 1 });
  });
};

const toggleCheck = (item) => {
  const index = items.value?.findIndex((e) => e.id == item.id);
  items.value[index].isReady = !items.value[index].isReady;
  if (items.value[index].isReady) items.value[index].checked = true;
  else items.value[index].checked = false;
};

const toggleAvailable = (item) => {
  const index = items.value?.findIndex((e) => e.id == item.id);
  items.value[index].notAvailable = !items.value[index].notAvailable;
  if (items.value[index].notAvailable) items.value[index].checked = true;
  else items.value[index].checked = false;
};
</script>
