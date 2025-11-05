import { CardExperience } from "@/components/card/experienceCard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, it, expect } from "vitest";

vi.mock("@/store/cartStore", () => {
  const addItemMock = vi.fn();
  const openCartMock = vi.fn();
  const useCartStore = (selector: any) =>
    selector({ addItem: addItemMock, openCart: openCartMock });
  return { useCartStore, addItemMock, openCartMock };
});
