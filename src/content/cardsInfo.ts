// Centralized content data for the home hover cards
// Images live under /public; reference with absolute paths

export type HomeCardId = "labs" | "rooms" | "events" | "trails";

export interface HomeCard {
  id: HomeCardId;
  images: string[];
}

export const homeCards: HomeCard[] = [
  { id: "labs", images: ["", "", ""] },
  { id: "rooms", images: ["", "", ""] },
  { id: "events", images: ["", "", ""] },
  { id: "trails", images: ["", "", ""] },
];
