<script setup lang="ts">
import { Form } from "ant-design-vue";
import { useMapStore } from "~~/stores/useMapStore";

const mapStore = useMapStore();

const user = useSupabaseUser();
const router = useRouter();
const useForm = Form.useForm;
const { getUserProfile, updateUsername, upsertCoordinates } = useUserProfile();
const formState = reactive<{
  username: string;
  latitude: number | null;
  longitude: number | null;
}>({
  username: "",
  latitude: null,
  longitude: null,
});

const errorMsg = ref("");
const successMsg = ref("");

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
      errorMsg.value = "";
      successMsg.value = "";
      const body = toRaw(formState);
      if (body.username && body.latitude && body.longitude) {
        const profileError = await updateUsername(body.username);
        const coordinatesError = await upsertCoordinates(
          body.latitude,
          body.longitude
        );

        if (profileError || coordinatesError) {
          errorMsg.value = "something went wrong bra";
          return;
        }

        const currentUserId = user?.value?.id;
        console.log("llegue hasta aca", currentUserId, mapStore.friends.length);
        if (currentUserId && mapStore.friends.length) {
          console.log("sip");
          const userInFriends = mapStore.friends.find(
            (f) => f.id === currentUserId
          );
          if (userInFriends) {
            console.log("found");
            userInFriends.lat = body.latitude;
            userInFriends.lng = body.longitude;
            userInFriends.username = body.username;

            if (mapStore.selectedFriendIds.includes(currentUserId)) {
              console.log("is selected");
              mapStore.paintFriends();
            }
          }
        }

        if (!profileError && !coordinatesError) {
          successMsg.value = "congrats, changes have been submitted :)";
          return router.push({ name: "map" });
        }
      }
    })
    .catch((error) => console.log(error));
};

onMounted(() => {
  const coordinates = profile.value?.coordinates;

  if (coordinates && !Array.isArray(coordinates)) {
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    if (profile.value && profile.value.username && latitude && longitude) {
      formState.username = profile.value.username;
      formState.latitude = latitude;
      formState.longitude = longitude;
    }
  }
});

const initialCoordinates = computed(() => {
  const coordinates = profile.value?.coordinates;
  if (coordinates && !Array.isArray(coordinates)) {
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
  }
  return null;
});
</script>
<template>
  <div>
    <a-form :model="formState" name="registerForm" layout="vertical">
      <div class="flex place-items-center space-x-5">
        <a-form-item>
          <FormUpdateAvatar
            v-if="user?.id"
            :avatarUrl="profile?.avatar_url || ''"
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
          :initial-coordinates="initialCoordinates"
          @onChangeCoords="onChangeCoords"
          class="w-screen md:w-500px h-100"
        />
      </a-form-item>

      <div
        class="w-full flex justify-center flex flex-col place-items-center mt-5"
      >
        <a-button type="primary" @click="onSubmit" html-type="submit"
          >Submit</a-button
        >
        <div>
          <small v-if="errorMsg" class="text-red-500 block">{{
            errorMsg
          }}</small>
          <small v-if="successMsg" class="text-green-500">{{
            successMsg
          }}</small>
        </div>
      </div>
    </a-form>
  </div>
</template>
