<script setup lang="ts">
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";
import L from "leaflet";
import { Ref } from "vue";
import { Form } from "ant-design-vue";
import { nanoid } from "nanoid";
import { useStorage } from "@vueuse/core";
import { Friends } from "../stores/useMapStore";

const user = useSupabaseUser();
const client = useSupabaseClient();

const localStorage = useStorage("dummyFriends", [] as Friends);

const { getUserProfile } = useUserProfile(client, user);

const store = useMapStore();

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
    const data = await getUserProfile();
    store.userProfile = data;
    await nextTick();
    store.map = useMap("map", {
      center: [-33.443, -70.637],
      zoom: 13,
    });

    if (store.map) {
      if (localStorage.value) {
        store.friends = [...store.friends, ...localStorage.value];
      }
      store.map.on("click", function (env) {
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
        addFriendMarker.value.addTo(store.map as L.Map);
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
    store.paintFriends();
  }
});

watch(
  () => store.selectedFriendIds,
  (newVal, oldVal) => {
    if (true) {
      store.paintFriends();
      const dummyFriends = store.friends.filter((f) => f.type === "local");
      localStorage.value = dummyFriends;
    }
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
    store.friends.push({
      ...addDummyFriendFormState,
      id: newId,
      type: "local",
    });
    store.selectedFriendIds = [...store.selectedFriendIds, newId];
    removeAddFriendMarker();
  });
};

const clearFriends = () => (store.selectedFriendIds = []);
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
    <!-- <a-button @click="removeAddFriendMarker">Close</a-button> -->
  </div>

  <a-select
    v-model:value="store.selectedFriendIds"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="store.friends"
    size="large"
    :allow-clear="true"
    @clear="clearFriends"
    :field-names="{ label: 'username', value: 'id' }"
  >
    <template #option="{ username, type }">
      <div class="flex w-full justify-between">
        <p>
          {{ username }} {{ type && type === "local" ? "(added by you)" : "" }}
        </p>
        <p class="mr-5" @click.stop="() => null">Erase</p>
      </div>
    </template>
  </a-select>
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
