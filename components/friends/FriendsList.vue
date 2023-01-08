<script lang="ts" setup>
const friends = ref([]);
const invitedFriends = ref([]);
const pendingFriends = ref([]);

const config = useRuntimeConfig();

const getFriends = async () =>
  await useFetch("/api/get-friends").then((res) => {
    const friendsData = res.data;
    console.log(friendsData);
    friends.value = friendsData.value?.friends;
    invitedFriends.value = friendsData.value?.invited;
    pendingFriends.value = friendsData.value?.pending;
    return res;
  });

onMounted(async () => {
  getFriends();
});

const deleteFriend = async (friendId: string) => {
  await useFetch("/api/delete-friend", {
    method: "DELETE",
    body: JSON.stringify({ friendId: friendId }),
  });
  await getFriends();
};

const acceptFriend = async (friendId: string) => {
  await useFetch("/api/accept-friend", {
    method: "POST",
    body: JSON.stringify({ friendId: friendId }),
  });
  await getFriends();
};
</script>

<template>
  <div class="mt-5">
    <FriendsSingleList
      v-slot="slotProps"
      :list="invitedFriends"
      title="Sended Invitations"
    >
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Cancel</p>
    </FriendsSingleList>
    <FriendsSingleList
      v-slot="slotProps"
      :list="pendingFriends"
      title="Pending invitation"
    >
      <p class="text-green-500" @click="acceptFriend(slotProps.id)">Accept</p>
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Cancel</p>
    </FriendsSingleList>
    <FriendsSingleList v-slot="slotProps" :list="friends" title="Friends">
      <p class="text-red-500" @click="deleteFriend(slotProps.id)">Delete</p>
    </FriendsSingleList>
  </div>
</template>
