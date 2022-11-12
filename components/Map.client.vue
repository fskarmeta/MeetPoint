<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import useMap from "~~/composables/useMap";
import { useMapStore } from "~~/stores/useMapStore";

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

// const test = () =>
//   map.value.eachLayer((layer) => {
//     layer.remove();
//   });
</script>
<template>
  <!-- <Button @click="test">test</Button> -->
  <div id="map" class="h-full w-full"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
