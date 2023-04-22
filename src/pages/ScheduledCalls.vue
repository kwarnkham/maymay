<template>
  <q-page padding>
    <q-list v-if="pagination" separator bordered>
      <q-item v-for="followUpVisit in pagination.data" :key="followUpVisit.id">
        <q-item-section>
          <q-item-label caption>
            {{ followUpVisit.follow_up.name }}
          </q-item-label>

          <q-item-label overline>
            {{ followUpVisit.visit.patient.phone }}
            {{ followUpVisit.visit.patient.name }}
          </q-item-label>
          <div>
            <q-btn
              icon="launch"
              flat
              @click="
                $router.push({
                  name: 'visit-details',
                  params: {
                    visit: followUpVisit.visit_id,
                  },
                })
              "
            ></q-btn>
            <q-btn icon="done" flat @click="markAsDone(followUpVisit)"></q-btn>
          </div>
        </q-item-section>
        <q-item-section side top>
          <q-item-label> {{ followUpVisit.due_on }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { pagination } = usePagination("follow-up-visits");
const { dialog } = useQuasar();
const { api } = useUtil();
const markAsDone = (followUpVisit) => {
  dialog({
    title: "Mark as finished?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `follow-up-visits/${followUpVisit.id}/finish`,
    }).then((response) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == response.data.follow_up_visit.id
      );

      pagination.value.data.splice(index, 1);
    });
  });
};
</script>
