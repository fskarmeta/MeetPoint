<script lang="ts" setup>
const friends = ref([]);
const pendingFriends = ref([]);

onMounted(async () => {
  const { data: friendsData } = await useFetch("/api/get-friends");
  friends.value = friendsData.value?.friends;
  pendingFriends.value = friendsData.value?.pending;
});
</script>

<template>
  <div class="mt-5">
    <pre>
        {{ pendingFriends }}
    </pre>
  </div>
</template>
