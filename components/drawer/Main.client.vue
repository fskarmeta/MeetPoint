<script lang="ts" setup>
import FriendsListClient from "../friends/FriendsList.client.vue";
import SearchInputClient from "../friends/SearchInput.client.vue";

const activeKey = ref("1");
</script>

<template>
  <div style="color: white">
    <a-tabs
      v-model:activeKey="activeKey"
      size="large"
      :destroy-inactive-tab-pane="true"
    >
      <a-tab-pane key="1" tab="Friends">
        <SearchInputClient />
        <FriendsListClient />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Update Profile">
        <FormRegister />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
