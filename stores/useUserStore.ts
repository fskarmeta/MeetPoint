import { definePiniaStore } from "~~/.nuxt/imports";
import { useMapStore } from "./useMapStore";

interface Friend {
  id: string;
  username: string;
  avatar_url: string; 
  coordinates?: {
    created_at: string;
    id: string;
    longitude: number;
    latitude: number;
  };
}

export const useUserStore = definePiniaStore("userStore", {
  state: () => ({
    userProfile: {},
    loading: false,
    friends: <Friend[]>[],
    invited:  <Friend[]>[],
    pending:  <Friend[]>[],
  }),
  actions: {
    async getFriends(withMapUpdate = false) {
      console.log("corriendo");
      this.loading = true;
      await useFetch("/api/get-friends").then((res) => {
        const friendsData = res.data;
        if (friendsData) {
          this.friends = friendsData.value?.friends;
          this.invited = friendsData.value?.invited;
          this.pending = friendsData.value?.pending;

          if (withMapUpdate) {
            const mapStore = useMapStore();
            console.log(this.friends);
            const acceptedFriends = this.friends
              .filter((f) => f.coordinates)
              .map((f) => ({
                lat: f?.coordinates?.latitude,
                lng: f?.coordinates?.longitude,
                id: f.id,
                icon: f.avatar_url,
                username: f.username,
              }));
            mapStore.friends = [...mapStore.friends, ...acceptedFriends];
          }
        }
      });
      this.loading = false;
    },
  },
  getters: {},
});
