<script setup lang="ts">
import { Drawer as ADrawer } from "ant-design-vue";
const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const router = useRouter();

const drawerVisible = ref(false);
const signInModalVisible = ref(false);

const userProfile = await useUserProfile().getUserProfile();
console.log(userProfile);

const logout = async () => {
  await client.auth.signOut();
  router.push("/");
};

const login = async (
  provider: "github" | "google" | "gitlab" | "bitbucket"
) => {
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + "/redirect",
    },
  });
  if (error) {
    return alert("Something went wrong !");
  }
};
</script>

<template>
  <AModal
    v-model:visible="signInModalVisible"
    title="Sign in!"
    :footer="false"
    @ok="() => null"
  >
    <p>Save your location &#127752;</p>
    <p>Invite friends and get their location* &#128108;</p>
    <p>Change your icon &#128123;</p>
    <div class="w-full flex justify-center my-10" @click="login('google')">
      <AButton type="primary">
        <template #icon><GoogleOutlined /></template>
        Sign in with Google</AButton
      >
    </div>
    <small>* Only friends will be able to see your location</small>
  </AModal>
  <div class="w-full h-screen">
    <a-drawer
      :width="500"
      title="Basic Drawer"
      placement="left"
      :visible="drawerVisible"
      @close="drawerVisible = false"
      :body-Style="{ background: 'white' }"
      :header-style="{ background: 'white', border: 'none' }"
    >
      <DrawerMain />
    </a-drawer>
    <nav class="h-10 bg-cyan-800 flex justify-between px-2 place-items-center">
      <div @click="drawerVisible = true">
        <ATooltip>
          <template #title>Configuration</template>
          <MenuUnfoldOutlined
            class="cursor-pointer"
            :style="{ fontSize: '1.5rem' }"
          />
        </ATooltip>
      </div>
      <div class="flex space-x-10 place-items-center">
        <div v-if="user" @click="logout" class="flex space-x-5">
          <div>{{ userProfile?.username }}</div>
          <ATooltip>
            <template #title>Logout</template>
            <ExportOutlined
              class="cursor-pointer"
              :style="{ fontSize: '1.5rem' }"
            />
          </ATooltip>
        </div>
        <div v-else="user" @click="signInModalVisible = true">Login</div>
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
