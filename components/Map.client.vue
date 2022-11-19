<script setup lang="ts">
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";
import friends from "~~/utils/friends";
import L from "leaflet";
import { Ref } from "vue";
import { Form } from "ant-design-vue";

const store = useMapStore();

const addFriendMarker = ref<L.Marker | null>(null);

const isFriendPopupOpen = ref(false);

const addFriendPopup: Ref<L.Popup | null> = ref(null);
const addFriendRef = ref<HTMLElement>() as unknown as HTMLElement;

onMounted(async () => {
  if (process.client) {
    await nextTick();
    store.map = useMap("map", {
      center: [-33.443, -70.637],
      zoom: 13,
    });

    if (store.map) {
      store.map.on("click", function (env) {
        isFriendPopupOpen.value = false;
        console.log(env.latlng);
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
        isFriendPopupOpen.value = true;
      });
    }
    store.paintFriends();
  }
});

watch(
  () => store.selectedFriendIds,
  (newVal, oldVal) => {
    if (newVal.length || oldVal.length === 1) {
      store.paintFriends();
    }
  }
);

const useForm = Form.useForm;

const formState = reactive({
  username: "",
  latitude: null,
  longitude: null,
});

const rulesRef = reactive({
  username: [
    {
      required: true,
      message: "bra",
    },
  ],
});

const { validate, validateInfos, resetFields } = useForm(formState, rulesRef);

const removeAddFriendMarker = () => {
  if (addFriendMarker.value && addFriendPopup.value) {
    addFriendMarker.value.remove();
    addFriendPopup.value.remove();
    addFriendMarker.value = null;
    addFriendPopup.value = null;
    resetFields();
  }
};

const submitSomeone = () => {
  validate().then(() => console.log("valid"));
};
</script>
<template>
  <div v-show="isFriendPopupOpen" ref="addFriendRef">
    <a-form :model="formState" name="addSomeoneForm" layout="vertical">
      <a-form-item v-bind="validateInfos.username">
        <div class="flex mt-2">
          <a-input
            placeholder="Add someone"
            v-model:value="formState.username"
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
    :options="friends"
    :field-names="{ label: 'name', value: 'id' }"
  ></a-select>
  <div id="map" class="h-full w-full relative">
    <div class="absolute bg-red-200 text-3xl z-9999 right-0 mr-5 mt-5">
      Add friend
    </div>
  </div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
