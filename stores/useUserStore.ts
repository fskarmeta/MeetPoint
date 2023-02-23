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
  } | null;
}

export const useUserStore = definePiniaStore("userStore", {
  state: () => ({
    userProfile: {},
    loading: false,
    friends: <Friend[]>[],
    invited: <Friend[]>[],
    pending: <Friend[]>[],
  }),
  actions: {
    async getFriends(withMapUpdate = false) {
      console.log("corriendo");
      this.loading = true;
      await useFetch("/api/get-friends").then((res) => {
        const friendsData = res.data;
        if (
          friendsData &&
          friendsData.value?.friends &&
          friendsData.value?.invited &&
          friendsData.value?.pending
        ) {
          this.friends = friendsData.value?.friends;
          this.invited = friendsData.value?.invited;
          this.pending = friendsData.value?.pending;

          if (withMapUpdate) {
            const mapStore = useMapStore();
            console.log(this.friends);
            const acceptedFriends = this.friends
              .filter(
                (f) =>
                  f.coordinates &&
                  f.coordinates?.latitude &&
                  f.coordinates.longitude
              )
              .map((f) => ({
                lat: f.coordinates!.latitude,
                lng: f.coordinates!.longitude,
                id: f.id,
                avatar_url: f.avatar_url,
                username: f.username,
              }));
            mapStore.friends = [...mapStore.friends, ...acceptedFriends];
          }
        }
      });
      this.loading = false;
    },
    handleDeleteFriend(id: string) {
      const mapStore = useMapStore();

      if (mapStore.friends.some((f) => f.id === id)) {
        console.log("yeap friend");
        mapStore.friends = mapStore.friends.filter((f) => f.id !== id);
      }
      this.invited = this.invited.filter((f) => f.id !== id);
      this.friends = this.friends.filter((f) => f.id !== id);
      this.pending = this.pending.filter((f) => f.id !== id);

      if (mapStore.selectedFriendIds.includes(id)) {
        mapStore.selectedFriendIds = mapStore.selectedFriendIds.filter(
          (friendId) => friendId !== id
        );
        mapStore.paintFriends();
      }
    },
    handleAcceptFriend(id: string) {
      const pendingFriends = this.pending;
      this.pending = this.pending.filter((f) => f.id !== id);
      const acceptedFriend = pendingFriends.find((f) => f.id === id);
      if (acceptedFriend) {
        this.friends.push(acceptedFriend);
        this.getFriends(true);
      }
    },
  },
  getters: {},
});
