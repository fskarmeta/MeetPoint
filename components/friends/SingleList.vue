<script lang="ts" setup>
const config = useRuntimeConfig();

defineProps<{
  list: any[];
  title: string;
}>();

const userProfileImage = (avatarUrl: string) => {
  return avatarUrl.includes("https://")
    ? avatarUrl
    : config.AVATAR_STORAGE_URL + avatarUrl;
};
</script>

<template>
  <div v-if="list.length">
    <h3>{{ title }}</h3>
    <a-list item-layout="horizontal" :data-source="list">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item.username">
            <template #avatar>
              <a-avatar :src="userProfileImage(item.avatar_url)" />
            </template>
          </a-list-item-meta>
          <template #actions>
            <slot :id="item.id"></slot>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
