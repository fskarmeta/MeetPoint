import { definePiniaStore } from "~~/.nuxt/imports";
import friends from "~~/utils/friends";
import L, { marker } from "leaflet";
import { createRandomColor } from "~~/utils/helpers";
import { centerIcon } from "~~/utils/leaflet";

interface State {
  userProfile: any;
  map: L.Map;
  selectedFriendIds: (number | string)[];
  friends: { name: string; lat: number; lng: number; id: number | string }[];
  friendsMarkers: L.Marker[];
  friendsLinesToCenter: L.Polyline[];
  centerMarker: L.Marker | null;
  calculating: boolean;
}

export const useMapStore = definePiniaStore("mapStore", {
  state: (): State => ({
    userProfile: {},
    map: null as unknown as L.Map,
    selectedFriendIds: [],
    friends: friends,
    friendsMarkers: [],
    friendsLinesToCenter: [],
    centerMarker: null,
    calculating: false,
  }),
  actions: {
    paintFriends() {
      this.calculating = true;
      console.log("start");
      try {
        const friends = this.friends.filter((friend) =>
          this.selectedFriendIds.includes(friend.id)
        );
        this.removeElementsFromMap();
        console.log(friends);
        const length = friends.length;
        const coordinatesSum = friends.reduce(
          (a, b) => ({ lat: a.lat + b.lat, lng: a.lng + b.lng }),
          { lat: 0, lng: 0 }
        );
        const averageCoordinates: [number, number] = [
          coordinatesSum.lat / length,
          coordinatesSum.lng / length,
        ];

        console.log(coordinatesSum);

        // add center marker
        if (coordinatesSum.lat && coordinatesSum.lng) {
          this.centerMarker = L.marker(
            { lat: averageCoordinates[0], lng: averageCoordinates[1] },
            {
              title: "Center",
              icon: centerIcon,
            }
          );
        }

        for (const { lat, lng, name, id } of friends) {
          const friendCoordinates: [number, number] = [lat, lng];

          // friend marker
          const friendIcon = L.icon({
            className: "friend-icon",
            iconUrl: `https://avatars.dicebear.com/api/bottts/avatar${id}.svg`,
            iconSize: [50, 50],
          });

          const popup = L.popup({ minWidth: 500 }).setContent(
            `<div id="friend-${id}" class="w-full"></div>`
          );
          const marker = L.marker(
            { lat, lng },
            { title: name, icon: friendIcon }
          ).bindPopup(popup);
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
      } catch (e) {
        console.log(e);
      }
      console.log("end");
      this.calculating = false;
    },
    addElementsTopMap() {
      if (this.centerMarker) {
        console.log("yep");
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
      }
      this.friendsMarkers.forEach((marker) => marker.remove());
      this.friendsLinesToCenter.forEach((line) => line.remove());
      this.friendsMarkers = [];
      this.friendsLinesToCenter = [];
    },
  },
});
