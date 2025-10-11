// Centralized content data for the home hover cards
// Images live under /public; reference with absolute paths

import labwebp from "/mock/lab.webp?url";
import roomwebp from "/mock/room.webp?url";
import eventwebp from "/mock/event.webp?url";
import trailwebp from "/mock/trail-1.webp?url";

export type HomeCardId = "labs" | "rooms" | "events" | "trails";

export interface HomeCard {
  id: HomeCardId;
  images: string[];
}

export const homeCards: HomeCard[] = [
  { id: "labs", images: [labwebp, labwebp, labwebp] },
  { id: "rooms", images: [roomwebp, roomwebp, roomwebp] },
  { id: "events", images: [eventwebp, eventwebp, eventwebp] },
  { id: "trails", images: [trailwebp, trailwebp, trailwebp] },
];
