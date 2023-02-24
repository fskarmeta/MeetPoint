<script lang="ts" setup>
import { useUserStore } from "~~/stores/useUserStore";
const userStore = useUserStore();

onMounted(async () => {
  userStore.getFriends();
});

const deleteFriend = async (friendId: string) => {
  userStore.handleDeleteFriend(friendId);
  useFetch("/api/delete-friend", {
    method: "DELETE",
    body: JSON.stringify({ friendId: friendId }),
  });
};

const acceptFriend = async (friendId: string) => {
  await useFetch("/api/accept-friend", {
    method: "POST",
    body: JSON.stringify({ friendId: friendId }),
  });
  userStore.handleAcceptFriend(friendId);
};
</script>

<template>
  <div class="mt-5">
    <FriendsSingleList
      v-slot="slotProps"
      :list="userStore.invited"
      title="Sent Invitations"
    >
      <ATooltip>
        <template #title>Cancel Invitation</template>
        <CloseOutlined
          :style="{ color: 'red' }"
          class="cursor-pointer"
          @click="deleteFriend(slotProps.id)"
        />
      </ATooltip>
    </FriendsSingleList>
    <FriendsSingleList
      v-slot="slotProps"
      :list="userStore.pending"
      title="Pending invitation"
    >
      <ATooltip>
        <template #title>Accept as friend</template>
        <CheckCircleOutlined
          :style="{ color: 'green' }"
          class="cursor-pointer"
          @click="acceptFriend(slotProps.id)"
        />
      </ATooltip>
      <ATooltip>
        <template #title>Reject Invitation</template>
        <CloseOutlined
          :style="{ color: 'red' }"
          class="cursor-pointer"
          @click="deleteFriend(slotProps.id)"
        />
        <CheckCircleOutlined />
      </ATooltip>
    </FriendsSingleList>
    <FriendsSingleList
      v-slot="slotProps"
      :list="userStore.friends"
      title="Friends"
    >
      <ATooltip>
        <template #title>Finish friendship</template>
        <CloseOutlined
          :style="{ color: 'red' }"
          class="cursor-pointer"
          @click="deleteFriend(slotProps.id)"
        />
        <CheckCircleOutlined />
      </ATooltip>
    </FriendsSingleList>
  </div>
</template>
