<script setup lang="ts">
import { Drawer as ADrawer } from "ant-design-vue";
const visible = ref(false);
</script>

<template>
  <div class="w-full h-screen">
    <a-drawer
      :width="500"
      title="Basic Drawer"
      placement="left"
      :visible="visible"
      @close="visible = false"
      class="opacity-80"
    >
      goli
    </a-drawer>
    <nav
      class="h-10 bg-yellow-200 flex justify-between px-10 place-items-center"
    >
      <div @click="visible = true">Actions</div>
      <div class="flex space-x-10 place-items-center">
        <p class="m-0 p-0">Logout</p>
        <p class="m-0 p-0">Profile</p>
      </div>
    </nav>
    <div class="mx-auto h-full flex justify-center">
      <slot />
    </div>
  </div>
</template>
