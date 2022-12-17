<script lang="ts" setup>
const activeKey = ref("1");
</script>

<template>
  <div style="color: white">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="Friends">
        <p>Invite Friends</p>
        <FriendsSearchInput />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Update Profile"
        >
        <FormRegister />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
