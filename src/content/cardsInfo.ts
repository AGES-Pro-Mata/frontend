// Centralized content data for the home hover cards
// Images live under /public; reference with absolute paths

export type HomeCardId = "labs" | "rooms" | "events" | "trails";

export interface HomeCard {
  id: HomeCardId;
  images: string[];
}

const mockLab = "/mock/lab.jpg";
const mockRoom = "/mock/room.jpg";
const mockEvent = "/mock/event.jpg";
const mockTrail = "/mock/trail-1.jpg";

export const homeCards: HomeCard[] = [
  { id: "labs", images: [mockLab, mockLab, mockLab] },
  { id: "rooms", images: [mockRoom, mockRoom, mockRoom] },
  { id: "events", images: [mockEvent, mockEvent, mockEvent] },
  { id: "trails", images: [mockTrail, mockTrail, mockTrail] },
];
