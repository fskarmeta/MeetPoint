<script setup lang="ts">
import { Form } from "ant-design-vue";

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const useForm = Form.useForm;
const { getUserProfile, updateUsername, upsertCoordinates } = useUserProfile(
  client,
  user
);
const formState = reactive<{
  username: string;
  latitude: number | null;
  longitude: number | null;
}>({
  username: "",
  latitude: null,
  longitude: null,
});

const { data: profile, refresh: refreshProfile } = await useAsyncData(
  "profiles",
  async () => await getUserProfile()
);

const onChangeCoords = ({ lat, lng }: { lat: number; lng: number }) => {
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
      if (body.username && body.latitude && body.longitude) {
        const profileError = await updateUsername(body.username);
        const coordinatesError = upsertCoordinates(
          body.latitude,
          body.longitude
        );
        if (!profileError && !coordinatesError) {
          return router.push({ name: "map" });
        }
      }
    })
    .catch((error) => console.log(error));
};
</script>
<template>
  <div>
    <a-form :model="formState" name="registerForm" layout="vertical">
      <div class="flex place-items-center space-x-5">
        <a-form-item>
          <FormUpdateAvatar
            v-if="user?.id"
            :avatarUrl="profile.avatar_url"
            :userId="user.id"
            @on-avatar-update="refreshProfile"
          />
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
