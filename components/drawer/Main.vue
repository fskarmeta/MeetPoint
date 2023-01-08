<script lang="ts" setup>
import FriendsFriendsList from "../friends/FriendsList.vue";
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
        <p>Invite Friends</p>
        <FriendsSearchInput />
        <FriendsFriendsList />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Update Profile">
        <FormRegister />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
