import L from "leaflet";

export default (
  elementId: string,
  mapBox: { center: [number, number]; zoom: number }
) => {
  const map = L.map(elementId, mapBox);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  return map;
};
