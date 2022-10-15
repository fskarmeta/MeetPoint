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
    console.log(ev.latlng); // ev is an event object (MouseEvent in this case)
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

  // const distancesMap = {};
  // const latLng2Meters = 111139;

  for (const { lat, lng, name } of friends) {
    // for (const friend of friends) {
    //   if (friend.name !== name) {
    //     const distance =
    //       Math.pow(
    //         Math.pow(lat - friend.lat, 2) + Math.pow(lng - friend.lng, 2),
    //         1 / 2
    //       ) * latLng2Meters;

    //     distancesMap[name]
    //       ? distancesMap[name].push(distance)
    //       : (distancesMap[name] = [distance]);
    //   }
    // }
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
  // console.log(distancesMap);
  // const distancesArray = Object.values(distancesMap).reduce(
  //   (a: number[], b: number[]) => [...a, ...b],
  //   []
  // ) as number[];

  // const uniqueDistanceValues = [
  //   ...new Set(distancesArray.sort((a, b) => a - b)),
  // ];
  // const minDistance = uniqueDistanceValues[0];
  // const maxDistante = uniqueDistanceValues[uniqueDistanceValues.length - 1];
  // const averageDistance =
  //   uniqueDistanceValues.reduce((a, b) => a + b) / uniqueDistanceValues.length;

  // friends.forEach(({ lat, lng }) => {
  //   const color = createRandomColor();
  //   L.circle([lat, lng], {
  //     radius: minDistance,
  //     color,
  //     fill: false,
  //   }).addTo(map);
  //   L.circle([lat, lng], {
  //     radius: maxDistante,
  //     color,
  //     fill: false,
  //   }).addTo(map);
  //   L.circle([lat, lng], {
  //     radius: averageDistance,
  //     color,
  //     fill: false,
  //   }).addTo(map);
  // });

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
