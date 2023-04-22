<template>
  <q-page padding>
    <q-list v-if="pagination" separator bordered>
      <q-item v-for="followUpVisit in pagination.data" :key="followUpVisit.id">
        <q-item-section>
          <q-item-label caption>
            {{ followUpVisit.follow_up.name }}
          </q-item-label>

          <q-item-label
            overline
            class="q-py-md"
            @click="callMobile(followUpVisit.visit.patient.phone)"
          >
            <q-badge class="q-mr-sm">
              <span class="text-white">
                {{ followUpVisit.visit.patient.phone }}</span
              >
            </q-badge>

            <span class="text-secondary">
              {{ followUpVisit.visit.patient.name }}
            </span>
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
          <q-item-label
            :class="{
              'text-positive':
                getDateDiff(
                  new Date(),
                  new Date(followUpVisit.due_on),
                  'days'
                ) == 0,
              'text-negative':
                getDateDiff(
                  new Date(),
                  new Date(followUpVisit.due_on),
                  'days'
                ) > 0,
            }"
          >
            {{ followUpVisit.due_on }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { date } from "quasar";
const { getDateDiff } = date;

const { pagination } = usePagination("follow-up-visits");
const { dialog } = useQuasar();
const { api } = useUtil();
const callMobile = (phoneNumber) => {
  window.open(`tel:${phoneNumber}`, "_self");
};
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
