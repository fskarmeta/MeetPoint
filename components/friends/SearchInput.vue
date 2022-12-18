<script setup lang="ts">
const selectedId = ref("");
const data = ref([]);

const filter = (value: string, option: any) => {
  console.log(value, option);
  return option?.username.toLowerCase().indexOf(value.toLowerCase()) >= 0;
};

const sendInvite = async () => {
  const test = await useFetch("/api/invite-friend", {
    headers: useRequestHeaders(["cookie"]) as unknown as string,
    method: "POST",
    body: {
      friendId: selectedId.value,
    },
  });
  console.log(test);
};

onMounted(async () => {
  const { data: friends } = await useFetch("/api/search-profile");
  console.log(friends.value.data);
  data.value = friends.value.data;
});
</script>

<template>
  <div class="flex">
    <a-select
      v-model:value="selectedId"
      show-search
      placeholder="input search text"
      style="width: 200px"
      :default-active-first-option="false"
      :show-arrow="false"
      :not-found-content="null"
      :options="data"
      :field-names="{ label: 'username', value: 'id' }"
      :filter-option="filter"
    ></a-select>
    <a-button @click="sendInvite">Send invi</a-button>
  </div>
</template>
