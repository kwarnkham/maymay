<template>
  <div v-if="pagination" class="column">
    <div class="q-my-xs">
      <q-input v-model="search" :label="$t('search')" />
    </div>
    <q-list bordered separator class="full-width col overflow-auto">
      <template v-for="user in pagination.data" :key="user.id">
        <q-item>
          <q-item-section>
            <q-item-label
              class="cursor-pointer"
              @click="showEditUserDialog(user)"
            >
              {{ user.username }}
            </q-item-label>
            <q-item-label caption v-if="user.name">
              {{ user.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label class="q-gutter-x-xs text-right">
              <q-badge
                class="cursor-pointer"
                v-for="role in roles"
                :key="role"
                :color="
                  user.roles.map((e) => e.name).includes(role.name)
                    ? 'pirmary'
                    : 'grey'
                "
                @click="toggleRole({ user, role })"
              >
                {{ role.name }}
              </q-badge>
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
import { inject, onMounted, onBeforeUnmount, ref } from "vue";
import UserFormDialog from "./dialogs/UserFormDialog.vue";

const props = defineProps({
  item_id: {
    type: [Number, String],
    required: false,
  },
});

const { api } = useUtil();

const bus = inject("bus");
const { dialog } = useQuasar();
const roles = ref([]);

const { pagination, current, max, fetch } = usePagination("users");

const { search } = useSearchFilter({
  fetch,
  current,
});

const addUser = (user) => {
  pagination.value.data.unshift(user);
};

const toggleRole = ({ user, role }) => {
  if (role.id == 1) return;
  api({
    method: "POST",
    url: `users/${user.id}/role`,
    data: {
      role_id: role.id,
    },
  }).then((response) => {
    const index = pagination.value.data.findIndex(
      (e) => e.id == response.data.user.id
    );
    pagination.value.data[index] = response.data.user;
  });
};

const showEditUserDialog = (user) => {
  dialog({
    component: UserFormDialog,
    componentProps: {
      user,
    },
  }).onOk((user) => {
    const index = pagination.value.data.findIndex((e) => e.id == user.id);
    pagination.value.data[index] = user;
  });
};

onMounted(() => {
  bus.on("userSubmitted", addUser);
  api({
    url: "roles",
    method: "GET",
  }).then((response) => {
    roles.value = response.data.roles;
  });
});

onBeforeUnmount(() => {
  bus.off("userSubmitted", addUser);
});
</script>
