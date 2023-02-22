<script lang="ts" setup>
import { nanoid } from "nanoid";
import { UploadChangeParam } from "ant-design-vue/es";
import { Database } from "~~/types/supabase";

const client = useSupabaseClient<Database>();
const config = useRuntimeConfig();

const props = defineProps({
  avatarUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["onAvatarUpdate"]);

const userProfileImage = computed(() => {
  return props.avatarUrl.includes("https://")
    ? props.avatarUrl
    : config.AVATAR_STORAGE_URL + props.avatarUrl;
});

const handleChangeImage = async (info: UploadChangeParam) => {
  if (info.file.status === "done" && info.file.originFileObj) {
    try {
      const avatarFile = info.file.originFileObj;
      const { data, error } = await client.storage
        .from("avatars")
        .upload(`public/${nanoid()}.png`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (data?.path) {
        await client
          .from("profiles")
          .update({ avatar_url: data.path })
          .eq("id", props.userId);
        emit("onAvatarUpdate");
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<template>
  <a-upload
    name="file"
    @change="handleChangeImage"
    :multiple="false"
    :maxCount="1"
    :showUploadList="false"
  >
    <!-- <pre>{{ userProfileImage }}</pre> -->
    <a-avatar size="large" :src="userProfileImage" />
  </a-upload>
</template>
