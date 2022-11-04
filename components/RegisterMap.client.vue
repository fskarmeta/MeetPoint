<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import useMap from "~~/composables/useMap";

const map: Ref<L.Map> = ref();
const marker = ref();

onMounted(async () => {
  if (process.client) {
    await nextTick();
    map.value = useMap("map", {
      center: [0, 0],
      zoom: 2,
    });
    map.value.on("click", function (ev) {
      if (marker.value) {
        console.log("yep");
        map.value.removeLayer(marker.value);
      }
      marker.value = L.marker(ev.latlng, {
        title: "Center",
      });

      marker.value.addTo(map.value);
      console.log(ev.latlng);
    });
  }
});
</script>
<template>
  <div id="map" class="h-1/2 w-screen"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
