<script setup lang="ts">
import L from "leaflet";
import { Ref } from "vue";
import useMap from "~~/composables/useMap";
import friends from "~~/utils/friends";

const map: Ref<L.Map> = ref();

const centerIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Circle_and_its_center.svg",
  iconSize: [50, 50],
});

const createRandomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

onMounted(async () => {
  if (process.client) {
    await nextTick();
    console.log("oli", document.getElementById("map"));
    map.value = useMap("map", {
      center: [-33.443, -70.637],
      zoom: 13,
    });
    paintFriends();
  }
});

const paintFriends = () => {
  const length = friends.length;
  const coordinatesSum = friends.reduce(
    (a, b) => ({ lat: a.lat + b.lat, lng: a.lng + b.lng }),
    { lat: 0, lng: 0 }
  );
  const averageCoordinates: [number, number] = [
    coordinatesSum.lat / length,
    coordinatesSum.lng / length,
  ];

  L.marker(
    { lat: averageCoordinates[0], lng: averageCoordinates[1] },
    {
      title: "Center",
      icon: centerIcon,
    }
  ).addTo(map.value);

  for (const { lat, lng, name } of friends) {
    const friendCoordinates: [number, number] = [lat, lng];

    const friendIcon = L.icon({
      className: "friend-icon",
      iconUrl:
        "https://lh3.googleusercontent.com/a/ALm5wu2e6rbUQZqjYd1u_8F0b4BWfWNtfZ3Z-Bg5toaiOQ=s96-c",
      iconSize: [50, 50],
    });

    const color = createRandomColor();
    const line = L.polyline([friendCoordinates, averageCoordinates], {
      color,
    });

    L.marker({ lat, lng }, { title: name, icon: friendIcon }).addTo(map.value);
    const tooltip = L.tooltip().setContent(name);
    line.bindTooltip(tooltip).addTo(map.value);
  }
};

const test = () =>
  map.value.eachLayer((layer) => {
    layer.remove();
  });
</script>
<template>
  <Button @click="test">test</Button>
  <div id="map" class="h-full w-full"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
