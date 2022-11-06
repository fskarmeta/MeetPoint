<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import useMap from "~~/composables/useMap";

const map: Ref<L.Map> = ref();
const marker = ref();

const emit = defineEmits(["onChangeCoords"]);

onMounted(async () => {
  if (process.client) {
    await nextTick();
    map.value = useMap("register-map", {
      center: [0, 0],
      zoom: 2,
    });
    map.value.on("click", function (ev) {
      if (marker.value) {
        map.value.removeLayer(marker.value);
      }
      marker.value = L.marker(ev.latlng, {
        title: "Home",
      });

      marker.value.addTo(map.value);
      emit("onChangeCoords", ev.latlng);
    });
  }
});
</script>
<template>
  <div id="register-map"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
