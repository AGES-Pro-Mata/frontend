import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminRequests from "@/components/table/adminRequests";
import type { TRequestListItem } from "@/entities/request-admin-response";

const mockRequests: TRequestListItem[] = [
  {
    id: "1",
    member: { name: "John", email: "john@test.com" },
    request: { type: "APPROVED" },
  },
  {
    id: "2",
    member: { name: "Jane", email: "jane@test.com" },
    request: { type: "CREATED" },
  },
];

// Mock dos componentes UI primeiro
vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: () => void;
  }) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      checked={checked}
      onChange={onCheckedChange}
    />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock do DataTable
vi.mock("@/components/table/index", () => {
  const DataTable: React.FC<{
    data: TRequestListItem[];
    columns?: Array<Record<string, unknown>>;
    setFilter?: (key: string, value: unknown) => void;
    filters?: Record<string, unknown>;
  }> = ({ data, setFilter, filters }) => {
    return (
      <div data-testid="datatable">
        {data.map((row, index) => (
          <div key={row.id || index} data-testid="row">
            {row.member.name}
          </div>
        ))}
        {setFilter && (
          <>
            <button 
              data-testid="trigger-page" 
              onClick={() => setFilter("page", 1)}
            >
              Trigger Page
            </button>
            <button 
              data-testid="trigger-limit" 
              onClick={() => setFilter("limit", 20)}
            >
              Trigger Limit
            </button>
            <button 
              data-testid="trigger-sort" 
              onClick={() => setFilter("sort", "member.name")}
            >
              Trigger Sort
            </button>
            <button 
              data-testid="trigger-dir" 
              onClick={() => setFilter("dir", "asc")}
            >
              Trigger Dir
            </button>
          </>
        )}
        {filters && (
          <div data-testid="filters-info">
            Page: {String(filters.page)}
          </div>
        )}
      </div>
    );
  };

  return { DataTable };
});

// Mock do dropdown menu
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick}>{children}</div>
  ),
}));

// Mock do router
vi.mock("@tanstack/react-router", () => {
  let mockPathname = "/admin/requests";
  
  return {
    useNavigate: () => vi.fn(),
    useRouterState: () => ({ location: { pathname: mockPathname } }),
    setMockPathname: (path: string) => { mockPathname = path; },
  };
});

const getCheckboxByLabel = (labelText: string) => {
  const allCheckboxes = screen.getAllByTestId('checkbox');
  const allLabels = screen.getAllByText(labelText);
  
  // Find the label element that contains this text
  const labelElement = allLabels.find(el => el.tagName === 'SPAN')?.closest('label');
  
  if (!labelElement) {
    throw new Error(`Label with text "${labelText}" not found`);
  }
  
  // Find the checkbox inside this label
  const checkbox = allCheckboxes.find(checkbox => labelElement.contains(checkbox));
  
  if (!checkbox) {
    throw new Error(`Checkbox with label "${labelText}" not found`);
  }
  
  return checkbox;
};

describe("AdminRequests Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial data", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("renders request items", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("John");
    expect(rows[1]).toHaveTextContent("Jane");
  });

  it("renders DataTable correctly", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("renders DataTable even when there are no requests", () => {
    render(<AdminRequests initialData={{ data: [] }} />);
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("switches to reservation tab", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    const reservationBtn = screen.getByText((t) =>
      t.includes("Solicitações de Reserva")
    );
    
    fireEvent.click(reservationBtn);
    expect(reservationBtn).toHaveClass("bg-contrast-green");
  });

  it("toggles checkbox filters correctly", async () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    const checkboxes = screen.getAllByTestId("checkbox");
    const firstCheckbox = checkboxes[0];
    
    expect(firstCheckbox).not.toBeChecked();
    fireEvent.click(firstCheckbox);
    await waitFor(() => expect(firstCheckbox).toBeChecked());
  });

  it("calls onFilterChange when status filter changes", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests }}
        onFilterChange={onFilterChange}
      />
    );
    
    const checkbox = getCheckboxByLabel("Criada");
    fireEvent.click(checkbox);
    
    expect(onFilterChange).toHaveBeenCalled();
  });

  it("handles filter state initialization", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Solicitações de Professor"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Solicitações de Reserva"))).toBeInTheDocument();
  });

  it("switches to professor tab and shows professor status filters", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    expect(professorBtn).toHaveClass("bg-contrast-green");
    expect(screen.getByText("Aprovada")).toBeInTheDocument();
    expect(screen.getByText("Rejeitada")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });

  it("filters professor requests by status", async () => {
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
      { id: "2", member: { name: "Prof B", email: "b@test.com" }, request: { type: "CREATED" } },
    ];
    
    render(<AdminRequests initialData={{ data: professorRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const aprovedCheckbox = getCheckboxByLabel("Aprovada");
    fireEvent.click(aprovedCheckbox);
    
    await waitFor(() => {
      const rows = screen.getAllByTestId("row");
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent("Prof A");
    });
  });

  it("handles setFilter with page key", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const triggerButton = screen.getByTestId("trigger-page");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      status: undefined,
      sort: undefined,
      dir: undefined,
    });
  });

  it("handles setFilter with limit key", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const triggerButton = screen.getByTestId("trigger-limit");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      status: undefined,
      sort: undefined,
      dir: undefined,
    });
  });

  it("handles setFilter with sort key", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const triggerButton = screen.getByTestId("trigger-sort");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: undefined,
      sort: "member.name",
      dir: undefined,
    });
  });

  it("handles setFilter with dir key", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const triggerButton = screen.getByTestId("trigger-dir");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: undefined,
      sort: undefined,
      dir: "asc",
    });
  });

  it("handles professor tab without calling onFilterChange", () => {
    const onFilterChange = vi.fn();
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(
      <AdminRequests
        initialData={{ data: professorRequests }}
        onFilterChange={onFilterChange}
      />
    );
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const aprovedCheckbox = getCheckboxByLabel("Aprovada");
    fireEvent.click(aprovedCheckbox);
    
    // onFilterChange should not be called for professor tab filters
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it("renders request columns with actions", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    
    // Component renders without errors
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("renders professor columns with actions", () => {
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(<AdminRequests initialData={{ data: professorRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("toggles professor status filter on and off", async () => {
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
      { id: "2", member: { name: "Prof B", email: "b@test.com" }, request: { type: "CREATED" } },
    ];
    
    render(<AdminRequests initialData={{ data: professorRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const aprovedCheckbox = getCheckboxByLabel("Aprovada");
    
    // First click - filter to only approved
    fireEvent.click(aprovedCheckbox);
    await waitFor(() => {
      const rows = screen.getAllByTestId("row");
      expect(rows).toHaveLength(1);
    });
    
    // Second click - remove filter, show all
    fireEvent.click(aprovedCheckbox);
    await waitFor(() => {
      const rows = screen.getAllByTestId("row");
      expect(rows).toHaveLength(2);
    });
  });

  it("handles multiple request status selections", async () => {
    const requests: TRequestListItem[] = [
      { id: "1", member: { name: "User 1", email: "u1@test.com" }, request: { type: "CREATED" } },
      { id: "2", member: { name: "User 2", email: "u2@test.com" }, request: { type: "APPROVED" } },
      { id: "3", member: { name: "User 3", email: "u3@test.com" }, request: { type: "REJECTED" } },
    ];
    
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: requests }}
        onFilterChange={onFilterChange}
      />
    );
    
    const createdCheckbox = getCheckboxByLabel("Criada");
    const approvedCheckbox = getCheckboxByLabel("Aprovada");
    
    fireEvent.click(createdCheckbox);
    fireEvent.click(approvedCheckbox);
    
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: expect.arrayContaining(["CREATED", "APPROVED"]),
      })
    );
  });

  it("does not call onFilterChange when in professor tab for page changes", () => {
    const onFilterChange = vi.fn();
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(
      <AdminRequests
        initialData={{ data: professorRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const triggerButton = screen.getByTestId("trigger-page");
    fireEvent.click(triggerButton);
    
    // Should not call onFilterChange for professor tab
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it("does not call onFilterChange when in professor tab for limit changes", () => {
    const onFilterChange = vi.fn();
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(
      <AdminRequests
        initialData={{ data: professorRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const triggerButton = screen.getByTestId("trigger-limit");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it("does not call onFilterChange when in professor tab for sort changes", () => {
    const onFilterChange = vi.fn();
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(
      <AdminRequests
        initialData={{ data: professorRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const triggerButton = screen.getByTestId("trigger-sort");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it("does not call onFilterChange when in professor tab for dir changes", () => {
    const onFilterChange = vi.fn();
    const professorRequests: TRequestListItem[] = [
      { id: "1", member: { name: "Prof A", email: "a@test.com" }, request: { type: "APPROVED" } },
    ];
    
    render(
      <AdminRequests
        initialData={{ data: professorRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const triggerButton = screen.getByTestId("trigger-dir");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it("handles setFilter with combined status and sort", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const checkbox = getCheckboxByLabel("Criada");
    fireEvent.click(checkbox);
    
    vi.clearAllMocks();
    
    const triggerButton = screen.getByTestId("trigger-sort");
    fireEvent.click(triggerButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: ["CREATED"],
      sort: "member.name",
      dir: undefined,
    });
  });

  it("uses pendingLimitRef for page changes after limit was set", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    // First set limit
    const limitButton = screen.getByTestId("trigger-limit");
    fireEvent.click(limitButton);
    
    vi.clearAllMocks();
    
    // Then change page
    const pageButton = screen.getByTestId("trigger-page");
    fireEvent.click(pageButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 2,
      limit: 20, // Should use the pending limit
      status: undefined,
      sort: undefined,
      dir: undefined,
    });
  });

  it("resets selectedRequestStatus when switching to reservation tab", () => {
    render(<AdminRequests initialData={{ data: mockRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    const reservationBtn = screen.getByText((t) => t.includes("Solicitações de Reserva"));
    fireEvent.click(reservationBtn);
    
    // Checkboxes should be unchecked
    const checkboxes = screen.getAllByTestId("checkbox");
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it("handles requests that are not professor status types", () => {
    const mixedRequests: TRequestListItem[] = [
      { id: "1", member: { name: "User A", email: "a@test.com" }, request: { type: "APPROVED" } },
      { id: "2", member: { name: "User B", email: "b@test.com" }, request: { type: "CANCELED" } },
      { id: "3", member: { name: "User C", email: "c@test.com" }, request: { type: "PAYMENT_SENT" } },
    ];
    
    render(<AdminRequests initialData={{ data: mixedRequests }} />);
    
    const professorBtn = screen.getByText((t) => t.includes("Solicitações de Professor"));
    fireEvent.click(professorBtn);
    
    // Should only show requests with professor status types (APPROVED, REJECTED, CREATED)
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(1); // Only APPROVED
    expect(rows[0]).toHaveTextContent("User A");
  });

  it("removes status filter when unchecking after selection", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const checkbox = getCheckboxByLabel("Criada");
    
    // First click - add filter
    fireEvent.click(checkbox);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ["CREATED"],
      })
    );
    
    vi.clearAllMocks();
    
    // Second click - remove filter
    fireEvent.click(checkbox);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: undefined, // Should be undefined when no statuses selected
      })
    );
  });

  it("uses default values when initialData is undefined", () => {
    render(<AdminRequests />);
    
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
    const rows = screen.queryAllByTestId("row");
    expect(rows).toHaveLength(0); // No data
  });

  it("uses default page and limit when not provided", () => {
    const onFilterChange = vi.fn();
    render(
      <AdminRequests
        initialData={{ data: mockRequests }}
        onFilterChange={onFilterChange}
      />
    );
    
    const triggerButton = screen.getByTestId("trigger-page");
    fireEvent.click(triggerButton);
    
    // Should use default values (page: 1, limit: 10)
    expect(onFilterChange).toHaveBeenCalledWith({
      page: 2,
      limit: 10, // default
      status: undefined,
      sort: undefined,
      dir: undefined,
    });
  });

  it("displays correct status map for request types", () => {
    const allStatusRequests: TRequestListItem[] = [
      { id: "1", member: { name: "U1", email: "u1@test.com" }, request: { type: "CANCELED_REQUESTED" } },
      { id: "2", member: { name: "U2", email: "u2@test.com" }, request: { type: "PEOPLE_REQUESTED" } },
    ];
    
    render(<AdminRequests initialData={{ data: allStatusRequests }} />);
    
    // Check that status labels are displayed
    expect(screen.getByText("Cancelamento Solicitado")).toBeInTheDocument();
    expect(screen.getByText("Usuários Solicitado")).toBeInTheDocument();
  });

  it("maintains filter state across re-renders", async () => {
    const onFilterChange = vi.fn();
    const { rerender } = render(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    const checkbox = getCheckboxByLabel("Criada");
    fireEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
    
    // Re-render with updated data
    rerender(
      <AdminRequests
        initialData={{ data: mockRequests, page: 1, limit: 10 }}
        onFilterChange={onFilterChange}
      />
    );
    
    // Checkbox should still be checked
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it("handles empty total in initialData", () => {
    render(<AdminRequests initialData={{ data: mockRequests, total: 0 }} />);
    
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });
});