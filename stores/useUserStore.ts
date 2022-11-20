import { definePiniaStore } from "~~/.nuxt/imports";

export const useUserStore = definePiniaStore("userStore", {
  state: () => ({
    userProfile: {},
  }),
  actions: {},
  getters: {},
});
