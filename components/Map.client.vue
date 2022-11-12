<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";
import friends from "~~/utils/friends";

const store = useMapStore();

onMounted(async () => {
  if (process.client) {
    await nextTick();
    store.map = useMap("map", {
      center: [-33.443, -70.637],
      zoom: 13,
    });
    store.paintFriends();
  }
});

const test = () => store.removeElementsFromMap();
</script>
<template>
  <Button @click="test">test</Button>
  <a-select
    v-model:value="store.selectedFriendIds"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="friends"
    :field-names="{ label: 'name', value: 'id' }"
  ></a-select>
  <div id="map" class="h-full w-full"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
