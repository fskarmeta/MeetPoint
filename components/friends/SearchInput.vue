<script setup lang="ts">
const selectedId = ref("");
const data = ref([
  {
    username: "bafian",
    value: "123124",
  },
]);

const filter = (value: string, option: any) => {
  console.log(value, option);
  return option?.username.toLowerCase().indexOf(value.toLowerCase()) >= 0;
};
</script>

<template>
  <div>
    <a-select
      v-model:value="selectedId"
      show-search
      placeholder="input search text"
      style="width: 200px"
      :default-active-first-option="false"
      :show-arrow="false"
      :not-found-content="null"
      :options="data"
      :field-names="{ label: 'username', value: 'value' }"
      :filter-option="filter"
    ></a-select>
  </div>
</template>
