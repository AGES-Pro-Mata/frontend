import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { renderWithProviders } from "@/test/test-utils";

describe("Pagination", () => {
  it("renders the nav and forwards props", () => {
    renderWithProviders(<Pagination data-testid="pagination" />);

    const nav = screen.getByTestId("pagination");

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("role", "navigation");
    expect(nav).toHaveAttribute("aria-label", "pagination");
  });

  it("renders content, items and link active state", () => {
    renderWithProviders(
      <PaginationContent data-testid="content">
        <PaginationItem data-testid="item-1">
          <PaginationLink data-testid="link-1" href="#" />
        </PaginationItem>
        <PaginationItem data-testid="item-2">
          <PaginationLink data-testid="link-2" href="#" isActive />
        </PaginationItem>
      </PaginationContent>
    );

    const content = screen.getByTestId("content");
    const item1 = screen.getByTestId("item-1");
    const link2 = screen.getByTestId("link-2");

    expect(content).toBeInTheDocument();
    expect(item1).toHaveAttribute("data-slot", "pagination-item");
    expect(link2).toHaveAttribute("aria-current", "page");
    expect(link2).toHaveAttribute("data-active", "true");
  });

  it("renders previous, next and ellipsis components", () => {
    renderWithProviders(
      <div>
        <PaginationPrevious data-testid="prev" />
        <PaginationNext data-testid="next" />
        <PaginationEllipsis data-testid="ellipsis" />
      </div>
    );

    const prev = screen.getByTestId("prev");
    const next = screen.getByTestId("next");
    const ellipsis = screen.getByTestId("ellipsis");

    expect(prev).toHaveAttribute("aria-label", "Go to previous page");
    expect(next).toHaveAttribute("aria-label", "Go to next page");

    expect(ellipsis).toHaveAttribute("data-slot", "pagination-ellipsis");
    expect(ellipsis).toHaveTextContent("More pages");
  });
});
