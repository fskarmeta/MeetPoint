<script setup lang="ts">
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";
import friends from "~~/utils/friends";
import L from "leaflet";
import { Ref } from "vue";

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
        if (addFriendMarker.value && addFriendPopup.value) {
          addFriendMarker.value.remove();
          addFriendPopup.value.remove();
          addFriendMarker.value = null;
          addFriendPopup.value = null;
        }
        addFriendPopup.value = L.popup({
          maxWidth: 200,
        }).setContent(addFriendRef);
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
</script>
<template>
  <div v-show="isFriendPopupOpen" ref="addFriendRef">lol this works omg xD</div>
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
