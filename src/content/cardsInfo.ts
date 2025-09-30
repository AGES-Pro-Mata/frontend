// Centralized content data for the home hover cards
// Images live under /public; reference with absolute paths

import labJpg from "/mock/lab.jpg?url";
import roomJpg from "/mock/room.jpg?url";
import eventJpg from "/mock/event.jpg?url";
import trailJpg from "/mock/trail-1.jpg?url";

export type HomeCardId = "labs" | "rooms" | "events" | "trails";

export interface HomeCard {
  id: HomeCardId;
  images: string[];
}

export const homeCards: HomeCard[] = [
  { id: "labs", images: [labJpg, labJpg, labJpg] },
  { id: "rooms", images: [roomJpg, roomJpg, roomJpg] },
  { id: "events", images: [eventJpg, eventJpg, eventJpg] },
  { id: "trails", images: [trailJpg, trailJpg, trailJpg] },
];
