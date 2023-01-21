<script setup lang="ts">
const config = useRuntimeConfig();

const selectedId = ref("");
const data = ref([]);
const msg = ref("");

const filter = (value: string, option: any) => {
  console.log(value, option);
  return option?.username.toLowerCase().indexOf(value.toLowerCase()) >= 0;
};

const sendInvite = async () => {
  const { data } = await useFetch("/api/invite-friend", {
    method: "POST",
    body: {
      friendId: selectedId.value,
    },
  });

  if (data.value.msg) {
    msg.value = data.value.msg;
  }
};

onMounted(async () => {
  const { data: friends } = await useFetch("/api/search-profile");
  data.value = friends.value.data;
});

watch(selectedId, (val) => {
  msg.value = "";
});

const userProfileImage = (avatarUrl: string) => {
  return avatarUrl.includes("https://")
    ? avatarUrl
    : config.AVATAR_STORAGE_URL + avatarUrl;
};
</script>

<template>
  <div>
    <p>Invite Users</p>
    <div class="flex">
      <a-select
        v-model:value="selectedId"
        show-search
        placeholder="input search text"
        style="width: 100%"
        :default-active-first-option="false"
        :show-arrow="false"
        :not-found-content="null"
        :options="data"
        :field-names="{ label: 'username', value: 'id' }"
        :filter-option="filter"
      >
        <template #option="{ username, avatar_url }">
          <a-avatar :src="userProfileImage(avatar_url)" />
          <span class="ml-5">{{ username }}</span>
        </template>
      </a-select>
      <a-button @click="sendInvite">Send invi</a-button>
    </div>
    <p v-if="msg" class="text-green-500 mt-1">{{ msg }}</p>
  </div>
</template>
