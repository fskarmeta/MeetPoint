import { definePiniaStore } from "~~/.nuxt/imports";
import friends from "~~/utils/friends";
import L, { marker } from "leaflet";
import { createRandomColor } from "~~/utils/helpers";
import { centerIcon } from "~~/utils/leaflet";

interface State {
  map: L.Map | null;
  selectedFriendIds: number[];
  friends: { name: string; lat: number; lng: number; id: number }[];
  friendsMarkers: L.Marker[];
  friendsLinesToCenter: L.Polyline[];
  centerMarker: L.Marker | null;
}

export const useMapStore = definePiniaStore("mapStore", {
  state: (): State => ({
    map: null,
    selectedFriendIds: [],
    friends: friends,
    friendsMarkers: [],
    friendsLinesToCenter: [],
    centerMarker: null,
  }),
  actions: {
    paintFriends() {
      this.removeElementsFromMap();
      const friends = this.friends.filter((friend) =>
        this.selectedFriendIds.includes(friend.id)
      );
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
      this.centerMarker = L.marker(
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
        this.addElementsTopMap();
      }
    },
    addElementsTopMap() {
      if (this.centerMarker) {
        this.centerMarker.addTo(this.map as L.Map);
        this.friendsMarkers.forEach((marker) =>
          marker.addTo(this.map as L.Map)
        );
        this.friendsLinesToCenter.forEach((line) =>
          line.addTo(this.map as L.Map)
        );
      }
    },
    removeElementsFromMap() {
      if (this.centerMarker) {
        this.centerMarker.remove();
        this.friendsMarkers.forEach((marker) => marker.remove());
        this.friendsLinesToCenter.forEach((line) => line.remove());
      }
    },
  },
});
