import * as componentsAuth from "@/components/auth";
import * as componentsCard from "@/components/card";
import * as componentsCarousel from "@/components/carousel";
import * as componentsInput from "@/components/input";
import * as componentsTypography from "@/components/typography";
import * as hooksIndex from "@/hooks";
import * as hooksAuth from "@/hooks/auth";
import * as hooksExperiences from "@/hooks/experiences";
import * as hooksReservations from "@/hooks/reservations";
import * as hooksShared from "@/hooks/shared";
import enLocale from "@/locale/en.json";
import ptLocale from "@/locale/pt.json";

describe("barrel exports and locales", () => {
  it("loads component and hook barrel modules", () => {
    expect(componentsAuth).toBeDefined();
    expect(componentsCard).toBeDefined();
    expect(componentsCarousel).toBeDefined();
    expect(componentsInput).toBeDefined();
    expect(componentsTypography).toBeDefined();
    expect(hooksIndex).toBeDefined();
    expect(hooksAuth).toBeDefined();
    expect(hooksExperiences).toBeDefined();
    expect(hooksReservations).toBeDefined();
    expect(hooksShared).toBeDefined();
  });

  it("loads locale dictionaries", () => {
    expect(enLocale).toBeDefined();
    expect(ptLocale).toBeDefined();
    expect(enLocale.auth?.login?.title).toBeDefined();
    expect(ptLocale.auth?.login?.title).toBeDefined();
  });
});
