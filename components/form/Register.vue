<script setup lang="ts">
import { Form } from "ant-design-vue";
import { nanoid } from "nanoid";
import { UploadChangeParam } from "ant-design-vue/es";

const user = useSupabaseUser();
const client = useSupabaseClient();
const config = useRuntimeConfig();
const router = useRouter();
const useForm = Form.useForm;

const formState = reactive({
  username: "",
  latitude: null,
  longitude: null,
});

const { data: profile, refresh: refreshProfile } = await useAsyncData(
  "profiles",
  async () => {
    try {
      const { data: profile, error } = await client
        .from("profiles")
        .select("username, avatar_url, coordinates(*)")
        .eq("id", user.value.id)
        .single();
      // const { data: coordinates } = await client
      //   .from("coordinates")
      //   .select("latitude, longitude")
      //   .eq("id", user.value.id)
      //   .single();
      console.log("error", error);
      console.log("in get profile", profile);
      return profile;
    } catch (e) {
      console.log("errrorr", e);
    }
  }
);

const onChangeCoords = ({ lat, lng }) => {
  formState.latitude = lat;
  formState.longitude = lng;
};

const rulesRef = reactive({
  username: [
    {
      required: true,
      message: "bra",
    },
  ],
  latitude: [
    {
      required: true,
      message: "bra",
      validator: () =>
        formState.latitude && formState.longitude
          ? Promise.resolve("nice")
          : Promise.reject("bra"),
    },
  ],
});

const { validate, validateInfos } = useForm(formState, rulesRef);

const onSubmit = () => {
  validate()
    .then(async () => {
      const body = toRaw(formState);
      const { error: profileError } = await client
        .from("profiles")
        .update({
          username: body.username,
        })
        .eq("id", user.value.id);
      const { error: coordinatesError } = await client
        .from("coordinates")
        .upsert({
          id: user.value.id,
          latitude: body.latitude,
          longitude: body.longitude,
        });
      console.log("profile update error", profileError);
      console.log("coordinates insert error", coordinatesError);
      if (!profileError && !coordinatesError) {
        return router.push({ name: "map" });
      }
    })
    .catch((error) => console.log(error));
};

const handleChangeImage = async (info: UploadChangeParam) => {
  if (info.file.status === "done") {
    try {
      const avatarFile = info.file.originFileObj;
      const { data, error } = await client.storage
        .from("avatars")
        .upload(`public/${nanoid()}.png`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });
      console.log(data, error);

      if (data.Key) {
        await client
          .from("profiles")
          .update({ avatar_url: data.Key })
          .eq("id", user.value.id);
        refreshProfile();
      }
    } catch (e) {
      console.log(e);
    }
  }
};

const userProfileImage = computed(() => {
  return profile.value.avatar_url.includes("https://")
    ? profile.value.avatar_url
    : config.AVATAR_STORAGE_URL + profile.value.avatar_url;
});
</script>
<template>
  <div>
    <pre>
      {{ profile }}
    </pre>
    <a-form :model="formState" name="registerForm" layout="vertical">
      <div class="flex place-items-center space-x-5">
        <a-form-item>
          <a-upload
            name="file"
            @change="handleChangeImage"
            :multiple="false"
            :maxCount="1"
            :showUploadList="false"
          >
            <a-avatar size="large" :src="userProfileImage" />
          </a-upload>
        </a-form-item>
        <a-form-item label="Username" v-bind="validateInfos.username">
          <a-input v-model:value="formState.username" />
        </a-form-item>
      </div>
      <a-form-item
        label="Where do you live bro? Please select it on the map"
        v-bind="validateInfos.latitude"
      >
        <RegisterMap
          @onChangeCoords="onChangeCoords"
          class="w-screen md:w-500px h-100"
        />
      </a-form-item>

      <div class="w-full flex justify-center mt-5">
        <a-button type="primary" @click="onSubmit" html-type="submit"
          >Submit</a-button
        >
      </div>
    </a-form>
  </div>
</template>
