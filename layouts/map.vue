<script setup lang="ts">
import { Drawer as ADrawer } from "ant-design-vue";
const client = useSupabaseAuthClient();

const visible = ref(false);
const router = useRouter();

const logout = async () => {
  await client.auth.signOut();
  router.push("/");
};
</script>

<template>
  <div class="w-full h-screen">
    <a-drawer
      :width="500"
      title="Basic Drawer"
      placement="left"
      :visible="visible"
      @close="visible = false"
      :body-Style="{ background: 'white' }"
      :header-style="{ background: 'white', border: 'none' }"
    >
      <DrawerMain />
    </a-drawer>
    <nav class="h-10 bg-cyan-800 flex justify-between px-10 place-items-center">
      <div @click="visible = true">Actions</div>
      <div class="flex space-x-10 place-items-center">
        <p class="m-0 p-0" @click="logout">Logout</p>
        <p class="m-0 p-0">Profile</p>
      </div>
    </nav>
    <div class="mx-auto content-height flex justify-center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.content-height {
  height: calc(100vh - 74px);
}
</style>

<style>
body,
html {
  color: #ccfbf1;
}
</style>
