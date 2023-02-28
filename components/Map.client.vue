<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import { Form } from "ant-design-vue";
import { nanoid } from "nanoid";
import { useStorage } from "@vueuse/core";
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";
import { useUserStore } from "~~/stores/useUserStore";
import { Friends } from "../stores/useMapStore";

const localStoredDummyFriends = useStorage("dummyFriends", [] as Friends);
const localStoredSelectedFriendsIds = useStorage(
  "selectedFriendsIds",
  [] as (string | number)[]
);

const { getUserProfile } = useUserProfile();

const mapStore = useMapStore();
const userStore = useUserStore();

const addFriendMarker = ref<L.Marker | null>(null);
const addFriendPopup: Ref<L.Popup | null> = ref(null);

const isFriendPopupOpen = ref(false);

const addFriendRef = ref<HTMLElement>() as unknown as HTMLElement;
const addFriendInputRef = ref<HTMLElement>();

const addDummyFriendFormState = reactive({
  username: "",
  lat: 0,
  lng: 0,
});

onMounted(async () => {
  if (process.client) {
    mapStore.calculating = true;
    let initialLat = null;
    let initialLng = null;
    const data = await getUserProfile();
    if (data && !Array.isArray(data?.coordinates)) {
      initialLat = data?.coordinates!.latitude!;
      initialLng = data?.coordinates!.longitude!;
      const thisUser = {
        username: data?.username!,
        avatar_url: data?.avatar_url!,
        id: data?.id!,
        lat: initialLat,
        lng: initialLng,
      };
      mapStore.friends = [thisUser];
      await userStore.getFriends(true);
    }

    // await nextTick();
    mapStore.map = useMap("map", {
      center:
        initialLat && initialLng
          ? [initialLat, initialLng]
          : [-33.443, -70.637],
      zoom: 9,
    });

    if (mapStore.map) {
      if (localStoredDummyFriends.value) {
        mapStore.friends = [
          ...mapStore.friends,
          ...localStoredDummyFriends.value,
        ];
      }

      const storedSelectedIds = localStoredSelectedFriendsIds.value;
      if (storedSelectedIds.length) {
        const filteredIds = storedSelectedIds.filter((id) =>
          mapStore.friends.some((obj) => obj.id === id)
        );
        mapStore.selectedFriendIds = filteredIds;
      }
      mapStore.map.on("click", function (env) {
        isFriendPopupOpen.value = false;
        removeAddFriendMarker();
        addFriendPopup.value = L.popup({
          minWidth: 240,
        })
          .setContent(addFriendRef)
          .on("remove", removeAddFriendMarker);
        addFriendMarker.value = L.marker(env.latlng, {
          title: "add friend",
        }).bindPopup(addFriendPopup.value);
        addFriendMarker.value.addTo(mapStore.map as L.Map);
        addFriendMarker.value.openPopup();
        addDummyFriendFormState.lng = env.latlng.lng;
        addDummyFriendFormState.lat = env.latlng.lat;
        isFriendPopupOpen.value = true;
        setTimeout(() => {
          if (addFriendInputRef.value) {
            addFriendInputRef.value.focus();
          }
        }, 200);
      });
    }
    mapStore.paintFriends();
  }
});

watch(
  () => mapStore.selectedFriendIds,
  () => {
    mapStore.paintFriends();
    const dummyFriends = mapStore.friends.filter((f) => f.type === "local");
    localStoredDummyFriends.value = dummyFriends;
    localStoredSelectedFriendsIds.value = mapStore.selectedFriendIds;
  }
);

const useForm = Form.useForm;

const rulesRef = reactive({
  username: [
    {
      required: true,
      message: "bra",
    },
  ],
});

const { validate, validateInfos, resetFields } = useForm(
  addDummyFriendFormState,
  rulesRef
);

const removeAddFriendMarker = () => {
  if (addFriendMarker.value && addFriendPopup.value) {
    try {
      addFriendMarker.value.remove();
      addFriendMarker.value = null;
      addFriendPopup.value = null;
    } catch (e) {
      console.log(e);
    }
    resetFields();
  }
};

const submitSomeone = () => {
  validate().then(() => {
    const newId = nanoid();
    mapStore.friends.push({
      ...addDummyFriendFormState,
      id: newId,
      type: "local",
    });
    mapStore.selectedFriendIds = [...mapStore.selectedFriendIds, newId];
    removeAddFriendMarker();
  });
};

const clearFriends = () => (mapStore.selectedFriendIds = []);

const onDeleteLocalFriend = (id: string) => {
  mapStore.friends = mapStore.friends.filter((f) => f.id !== id);
  mapStore.selectedFriendIds = mapStore.selectedFriendIds.filter(
    (f) => f !== id
  );
  localStoredDummyFriends.value = mapStore.friends.filter(
    (f) => f.type === "local"
  );
};
</script>

<template>
  <div v-show="isFriendPopupOpen" ref="addFriendRef">
    <a-form
      :model="addDummyFriendFormState"
      name="addSomeoneForm"
      layout="vertical"
    >
      <a-form-item v-bind="validateInfos.name">
        <div class="flex mt-2">
          <a-input
            ref="addFriendInputRef"
            placeholder="Add someone"
            v-model:value="addDummyFriendFormState.username"
            @keyup.enter="submitSomeone"
          />
          <a-button type="primary" @click="submitSomeone">
            <template #icon><PlusOutlined /></template>
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>

  <a-select
    v-model:value="mapStore.selectedFriendIds"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="mapStore.friends"
    size="large"
    :allow-clear="true"
    @clear="clearFriends"
    @click="removeAddFriendMarker"
    :field-names="{ label: 'username', value: 'id' }"
  >
    <template #option="{ username, type, id }">
      <div class="flex w-full justify-between">
        <p>
          {{ username }} {{ type && type === "local" ? "(added by you)" : "" }}
        </p>
        <p
          v-if="type && type === 'local'"
          class="mr-5"
          @click.stop="onDeleteLocalFriend(id)"
        >
          <DeleteOutlined
            :style="{
              fontSize: '16px',
              color: 'red',
            }"
          />
        </p>
      </div>
    </template>
    <template #menuItemSelectedIcon> </template>
  </a-select>

  <div
    v-if="mapStore.calculating"
    class="fixed z-9999 top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center"
  >
    <div class="spinner-border text-white h-16 w-16" role="status">
      <span>Loading...</span>
    </div>
  </div>
  <div id="map" class="h-full w-full relative">
    <!-- <div class="absolute bg-red-200 text-3xl z-9999 right-0 mr-5 mt-5">
      Add friend
    </div> -->
  </div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
