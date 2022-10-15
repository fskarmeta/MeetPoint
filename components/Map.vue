<script setup lang="ts">
import L from "leaflet";
import friends from "~~/utils/friends";

const createRandomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const centerIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Circle_and_its_center.svg",
  iconSize: [50, 50],
});

onMounted(() => {
  const map = L.map("map", {
    center: [-33.443, -70.637],
    zoom: 13,
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  map.on("click", function (ev) {
    console.log(ev.latlng);
  });

  const length = friends.length;
  const coordinatesSum = friends.reduce(
    (a, b) => ({ lat: a.lat + b.lat, lng: a.lng + b.lng }),
    { lat: 0, lng: 0 }
  );
  const averageCoodiantes: [number, number] = [
    coordinatesSum.lat / length,
    coordinatesSum.lng / length,
  ];

  const layer = L.marker(
    { lat: averageCoodiantes[0], lng: averageCoodiantes[1] },
    {
      title: "Center",
      icon: centerIcon,
    }
  ).addTo(map);

  for (const { lat, lng, name } of friends) {
    const friendCoordinates: [number, number] = [lat, lng];

    const friendIcon = L.icon({
      className: "friend-icon",
      iconUrl:
        "https://lh3.googleusercontent.com/a/ALm5wu2e6rbUQZqjYd1u_8F0b4BWfWNtfZ3Z-Bg5toaiOQ=s96-c",
      iconSize: [50, 50],
    });

    const color = createRandomColor();
    const line = L.polyline([friendCoordinates, averageCoodiantes], {
      color,
    });

    L.marker({ lat, lng }, { title: name, icon: friendIcon }).addTo(map);
    const tooltip = L.tooltip().setContent(name);
    line.bindTooltip(tooltip).addTo(map);
  }
  layer.addTo(map);
});
</script>
<template>
  <div id="map" class="h-full w-full"></div>
</template>

<style>
.friend-icon {
  border-radius: 50px;
}
</style>
