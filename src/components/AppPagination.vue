<template>
  <div
    class="row justify-center full-width"
    :class="{
      hidden: pagination.current_page == 1 && pagination?.next_page_url == null,
    }"
  >
    <q-pagination
      :max="max"
      input
      :model-value="modelValue"
      @update:model-value="
        (payload) => {
          $emit('update:model-value', payload);
        }
      "
    />
  </div>
</template>

<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  max: {
    type: [Number, String],
    required: true,
  },
  modelValue: {
    type: [Number, String],
    required: true,
  },
});

defineEmits(["update:model-value"]);
</script>
