<script lang="ts" setup>
import { useUserStore } from "~~/stores/useUserStore";
const userStore = useUserStore();

onMounted(async () => {
  userStore.getFriends();
});

const deleteFriend = async (friendId: string) => {
  await useFetch("/api/delete-friend", {
    method: "DELETE",
    body: JSON.stringify({ friendId: friendId }),
  });
  userStore.getFriends();
};

const acceptFriend = async (friendId: string) => {
  await useFetch("/api/accept-friend", {
    method: "POST",
    body: JSON.stringify({ friendId: friendId }),
  });
  userStore.getFriends();
};
</script>

<template>
  <div class="mt-5">
    <FriendsSingleList
      v-slot="slotProps"
      :list="userStore.invited"
      title="Sended Invitations"
    >
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Cancel</p>
    </FriendsSingleList>
    <FriendsSingleList
      v-slot="slotProps"
      :list="userStore.pending"
      title="Pending invitation"
    >
      <p class="text-green-500" @click="acceptFriend(slotProps.id)">Accept</p>
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Cancel</p>
    </FriendsSingleList>
    <FriendsSingleList v-slot="slotProps" :list="userStore.friends" title="Friends">
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Delete</p>
    </FriendsSingleList>
  </div>
</template>
