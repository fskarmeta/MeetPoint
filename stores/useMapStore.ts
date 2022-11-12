import { definePiniaStore } from "~~/.nuxt/imports";
import friends from "~~/utils/friends";
import L, { marker } from "leaflet";
import { createRandomColor } from "~~/utils/helpers";
import { centerIcon } from "~~/utils/leaflet";

export const useMapStore = definePiniaStore("mapStore", {
  state: () => ({
    map: <L.Map>null,
    friends: friends,
    friendsMarkers: <L.Marker[]>[],
    friendsLinesToCenter: <L.Polyline[]>[],
    centerMaker: <L.Marker>null,
  }),
  actions: {
    paintFriends() {
      const friends = this.friends;
      const length = friends.length;
      const coordinatesSum = friends.reduce(
        (a, b) => ({ lat: a.lat + b.lat, lng: a.lng + b.lng }),
        { lat: 0, lng: 0 }
      );
      const averageCoordinates: [number, number] = [
        coordinatesSum.lat / length,
        coordinatesSum.lng / length,
      ];

      // add center marker
      this.centerMaker = L.marker(
        { lat: averageCoordinates[0], lng: averageCoordinates[1] },
        {
          title: "Center",
          icon: centerIcon,
        }
      );

    
      for (const { lat, lng, name } of friends) {
        const friendCoordinates: [number, number] = [lat, lng];

        // friend marker
        const friendIcon = L.icon({
          className: "friend-icon",
          iconUrl:
            "https://lh3.googleusercontent.com/a/ALm5wu2e6rbUQZqjYd1u_8F0b4BWfWNtfZ3Z-Bg5toaiOQ=s96-c",
          iconSize: [50, 50],
        });

        const marker = L.marker(
          { lat, lng },
          { title: name, icon: friendIcon }
        );
        this.friendsMarkers.push(marker);


        // friend line to center
        const color = createRandomColor();
        const line = L.polyline([friendCoordinates, averageCoordinates], {
          color,
        });
        const tooltip = L.tooltip().setContent(name);
        line.bindTooltip(tooltip);
        this.friendsLinesToCenter.push(line);

        // paint
        this.addElementsTopMap()
      }
    },
    addElementsTopMap() {
      this.centerMaker.addTo(this.map);
      this.friendsMarkers.forEach((marker) => marker.addTo(this.map));
      this.friendsLinesToCenter.forEach((line) => line.addTo(this.map));
    },
  },
});
