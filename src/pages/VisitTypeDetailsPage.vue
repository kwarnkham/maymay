<template>
  <q-page padding>
    <div>
      Name : {{ visitType?.name }}
      <q-btn icon="edit" flat @click="editVisitType"></q-btn>
    </div>
    <div>
      <q-btn label="Add follow up" no-caps @click="createFollowUp" />
    </div>
    <q-list>
      <q-item
        v-for="followUp in visitType?.follow_ups"
        :key="followUp.id"
        clickable
        @click="editFollowUp(followUp)"
      >
        <q-item-section>
          <q-item-label>
            {{ followUp.name }}
          </q-item-label>
          <q-item-label caption>
            Due in {{ followUp.due_in_days }} days
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const visitType = ref(null);
const { api } = useUtil();
const { dialog } = useQuasar();

api({
  method: "GET",
  url: "visit-types/" + route.params.visitType,
}).then((response) => {
  visitType.value = response.data.visit_type;
});

const editFollowUp = (followUp) => {
  dialog({
    title: "Edit",
    message: "Choose an option:",
    options: {
      type: "radio",
      model: "name",
      items: [
        { label: "Name", value: "name" },
        { label: "Due in days", value: "due_in_days" },
        { label: "Delete", value: "delete" },
      ],
    },
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((key) => {
    if (key != "delete")
      dialog({
        title: "Edit",
        prompt: {
          model: "",
          placeholder: key,
        },
        position: "top",
        noBackdropDismiss: true,
        cancel: true,
      }).onOk((val) => {
        const data = { ...followUp };
        data[key] = val;
        api({
          method: "PUT",
          url: `follow-ups/${followUp.id}`,
          data,
        }).then((response) => {
          visitType.value = response.data.visit_type;
        });
      });
    else
      api({
        method: "DELETE",
        url: `follow-ups/${followUp.id}`,
      }).then((response) => {
        visitType.value = response.data.visit_type;
      });
  });
};

const editVisitType = () => {
  dialog({
    title: "Edit name for visit type",
    prompt: {
      model: visitType.value.name,
    },
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((name) => {
    api({
      method: "PUT",
      url: `visit-types/${route.params.visitType}`,
      data: {
        name,
      },
    }).then((response) => {
      visitType.value = response.data.visit_type;
    });
  });
};

const createFollowUp = () => {
  dialog({
    title: "Create follow up",
    prompt: {
      model: "",
      placeholder: "Name",
      isValid: (val) => val != "",
    },
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((name) => {
    dialog({
      title: "Create follow up",
      prompt: {
        model: "",
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        placeholder: "Due in days",
        isValid: (val) => val != "",
      },
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
    }).onOk((dueInDays) => {
      api({
        method: "POST",
        url: "follow-ups",
        data: {
          visit_type_id: visitType.value.id,
          name,
          due_in_days: dueInDays,
        },
      }).then((response) => {
        visitType.value = response.data.visit_type;
      });
    });
  });
};
</script>
