import { renderWithProviders } from "@/test/test-utils";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

describe("Table component", () => {
  it("renders slots and forwards className to elements", () => {
    const { container } = renderWithProviders(
      <Table className="my-table">
        <TableCaption className="cap">Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="head">Head</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="cell">Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const containerEl = container.querySelector(
      '[data-slot="table-container"]'
    );
    const tableEl = container.querySelector('[data-slot="table"]');
    const caption = container.querySelector('[data-slot="table-caption"]');
    const head = container.querySelector('[data-slot="table-head"]');
    const cell = container.querySelector('[data-slot="table-cell"]');

    expect(containerEl).toBeInTheDocument();
    expect(tableEl).toBeInTheDocument();
    expect(caption).toBeInTheDocument();
    expect(head).toBeInTheDocument();
    expect(cell).toBeInTheDocument();

    expect(tableEl).toHaveClass("my-table");
    expect(caption).toHaveClass("cap");
    expect(head).toHaveClass("head");
    expect(cell).toHaveClass("cell");
  });

  it("renders footer, row props and forwards arbitrary props", () => {
    const { container } = renderWithProviders(
      <Table data-test="table-test">
        <TableFooter data-test-footer>
          <TableRow data-test-row>
            <TableCell data-test-cell>F</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    const table = container.querySelector('[data-slot="table"]');
    const footer = container.querySelector('[data-slot="table-footer"]');
    const row = container.querySelector('[data-slot="table-row"]');
    const cell = container.querySelector('[data-slot="table-cell"]');

    expect(table).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(row).toBeInTheDocument();
    expect(cell).toBeInTheDocument();

    // forwarded arbitrary props should be present on host elements
    expect(table).toHaveAttribute("data-test", "table-test");
    expect(footer).toHaveAttribute("data-test-footer");
    expect(row).toHaveAttribute("data-test-row");
    expect(cell).toHaveAttribute("data-test-cell");
  });
});
