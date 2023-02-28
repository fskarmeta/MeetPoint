import friends from "~~/utils/friends";
import L from "leaflet";
import { centerIcon } from "~~/utils/leaflet";

const config = useRuntimeConfig();

export type Friends = {
  username: string;
  lat: number;
  lng: number;
  id: number | string;
  type?: "local";
  avatar_url?: string;
}[];
interface State {
  userProfile: any;
  map: L.Map;
  selectedFriendIds: (number | string)[];
  friendsAlt: any;
  friends: Friends;
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
    friendsAlt: [],
    friends: friends,
    friendsMarkers: [],
    friendsLinesToCenter: [],
    centerMarker: null,
    calculating: false,
  }),
  actions: {
    paintFriends() {
      this.calculating = true;
      try {
        const friends = this.selectedFriends;
        this.removeElementsFromMap();
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
        if (coordinatesSum.lat && coordinatesSum.lng) {
          this.centerMarker = L.marker(
            { lat: averageCoordinates[0], lng: averageCoordinates[1] },
            {
              title: "Center",
              icon: centerIcon,
              opacity: friends.length > 1 ? 1 : 0,
            }
          );
        }

        for (const { lat, lng, username, id, avatar_url = "" } of friends) {
          const friendCoordinates: [number, number] = [lat, lng];

          const parseImageUrl = (iconUrl: string) => {
            return iconUrl.includes("https://")
              ? iconUrl
              : config.AVATAR_STORAGE_URL + iconUrl;
          };

          // friend marker
          const friendIcon = L.icon({
            className: "friend-icon",
            iconUrl: avatar_url
              ? parseImageUrl(avatar_url)
              : `https://avatars.dicebear.com/api/bottts/avatar${id}.svg`,
            iconSize: [50, 50],
          });

          const div = document.createElement("div");
          const button = document.createElement("button");
          button.className =
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full";
          button.innerHTML = `unselect ${username}`;

          button.onclick = () => this.removeFriendFromPopup(id);

          div.appendChild(button);

          const popup = L.popup({ minWidth: 100 }).setContent(div);
          const marker = L.marker(
            { lat, lng },
            { title: username, icon: friendIcon }
          ).bindPopup(popup);
          this.friendsMarkers.push(marker);

          // friend line to center
          const color = "#000000"; //createRandomColor();
          const line = L.polyline([friendCoordinates, averageCoordinates], {
            color,
          });
          const tooltip = L.tooltip().setContent(username);
          line.bindTooltip(tooltip);
          this.friendsLinesToCenter.push(line);
        }
        this.addEelementsToMap();
      } catch (e) {
        console.log(e);
      }
      this.calculating = false;
    },
    addEelementsToMap() {
      const friends = this.selectedFriends;
      this.friendsMarkers.forEach((marker) => marker.addTo(this.map as L.Map));

      if (this.centerMarker && friends.length > 1) {
        this.centerMarker.addTo(this.map as L.Map);
        this.friendsLinesToCenter.forEach((line) =>
          line.addTo(this.map as L.Map)
        );
        // calculate minimum zoom level using friends lat lang and center marker
        if (friends.length > 1) {
          const bounds = L.latLngBounds(
            friends.map((friend) => [friend.lat, friend.lng])
          );
          bounds.extend(this.centerMarker.getLatLng());
          this.map.fitBounds(bounds);
        }
      }
    },
    removeElementsFromMap() {
      if (this.centerMarker) {
        this.centerMarker.remove();
        this.centerMarker = null;
      }
      this.friendsMarkers.forEach((marker) => marker.remove());
      this.friendsLinesToCenter.forEach((line) => line.remove());
      this.friendsMarkers = [];
      this.friendsLinesToCenter = [];
    },
    removeFriendFromPopup(id: string | number) {
      this.selectedFriendIds = this.selectedFriendIds.filter(
        (friend) => friend !== id
      );
    },
  },
  getters: {
    selectedFriends: (state) =>
      state.friends.filter((friend) =>
        state.selectedFriendIds.includes(friend.id)
      ),
  },
});
