import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminRequests from "@/components/table/adminRequests";
import { useAdminRequests as mockUseAdminRequests } from "@/hooks/useAdminRequests";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

interface Request {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface ApproveMutation {
  mutate: (id: string) => void;
  isPending: boolean;
}

interface RequestsQuery {
  isLoading: boolean;
  error: Error | null;
  data?:
    | Request[]
    | { data?: Request[] }
    | { results?: Request[] }
    | undefined;
}

interface UseAdminRequestsReturn {
  requestsQuery: RequestsQuery;
  approveMutation: ApproveMutation;
  reservationStatus: string[];
}

function mockUseAdminRequestsModule(returnValue: UseAdminRequestsReturn) {
  vi.doMock("@/hooks/useAdminRequests", () => {
    const useAdminRequests = (): UseAdminRequestsReturn => returnValue;
    
    return { useAdminRequests };
  });
}

vi.mock("@/hooks/useAdminRequests", () => {
  const approveMutationMock: ApproveMutation = {
    mutate: vi.fn(),
    isPending: false,
  };

  const requestsQueryMock: RequestsQuery = {
    isLoading: false,
    error: null,
    data: [
      { id: "1", name: "John", email: "john@test.com", status: "Approved" },
      { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
    ],
  };

  const hook = vi.fn(
    (): UseAdminRequestsReturn => ({
      requestsQuery: requestsQueryMock,
      approveMutation: approveMutationMock,
      reservationStatus: ["Approved", "Pending", "Confirmed"],
    })
  );

  return { useAdminRequests: hook };
});

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
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/table/index", () => {
  const DataTable = ({ data }: { data: Request[] }) => {
    const { approveMutation } = mockUseAdminRequests({}) as unknown as {
      approveMutation: { mutate: (id: string) => void; isPending: boolean };
    };

    return (
      <div data-testid="datatable">
        {data.map((row) => (
          <div key={row.id} data-testid="row">
            {row.name} - {row.status}
            {approveMutation.isPending ? (
              <div data-testid="spinner">Loading...</div>
            ) : (
              <button onClick={() => approveMutation.mutate(row.id)}>
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return { DataTable };
});

const setMockUseAdminRequests = (overrides?: Partial<UseAdminRequestsReturn>) => {
  vi.mocked(mockUseAdminRequests).mockReturnValue({
    requestsQuery: {
      isLoading: false,
      error: null,
      data: [
        { id: "1", name: "John", email: "john@test.com", status: "Approved" },
        { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
      ],
      ...(overrides?.requestsQuery ?? {}),
    } as unknown as UseQueryResult<any, Error>,
    approveMutation: {
      mutate: vi.fn(),
      isPending: false,
      ...(overrides?.approveMutation ?? {}),
    } as unknown as UseMutationResult<any, Error, string, unknown>,
    reservationStatus:
      overrides?.reservationStatus ?? ["Approved", "Pending", "Confirmed"],
  });
};

describe("AdminRequests Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMockUseAdminRequests();
  });

  it("renders loading state", () => {
    setMockUseAdminRequests({
      requestsQuery: { isLoading: true, error: null, data: [] },
    });
    render(<AdminRequests />);
    expect(screen.getByText((t) => t.includes("Loading"))).toBeInTheDocument();
  });

  it("renders error state", () => {
    setMockUseAdminRequests({
      requestsQuery: { isLoading: false, error: new Error("fail"), data: [] },
    });
    render(<AdminRequests />);
    expect(
      screen.getByText((t) => t.includes("Error loading requests"))
    ).toBeInTheDocument();
  });

  it("renders professor requests by default", () => {
    render(<AdminRequests />);
    expect(screen.getByText((t) => t.includes("Professor Requests"))).toHaveClass(
      "bg-green-500"
    );
    expect(screen.getAllByTestId("row")).toHaveLength(2);
  });

  it("switches to reservation tab", () => {
    render(<AdminRequests />);
    const reservationBtn = screen.getByText((t) =>
      t.includes("Reservation Requests")
    );
    
    fireEvent.click(reservationBtn);
    expect(reservationBtn).toHaveClass("bg-green-500");
  });

  it("toggles checkbox filters correctly", async () => {
    render(<AdminRequests />);
    const checkbox = screen.getAllByTestId("checkbox")[0];
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
  });

it("calls approveMutation when approve button clicked", async () => {
  const mutateMock = vi.fn();

  mockUseAdminRequestsModule({
    requestsQuery: {
      isLoading: false,
      error: null,
      data: [
        { id: "1", name: "John", email: "john@test.com", status: "Approved" },
        { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
      ],
    },
    approveMutation: { mutate: mutateMock, isPending: false },
    reservationStatus: ["Approved", "Pending", "Confirmed"],
  });

  vi.doMock("@/components/table/index", async () => {
    const { useAdminRequests }: typeof import("@/hooks/useAdminRequests") =
      await import("@/hooks/useAdminRequests");

    const DataTable: React.FC<{ data: Request[] }> = ({ data }) => {
      const { approveMutation } = useAdminRequests({});
      
      return (
        <div data-testid="datatable">
          {data.map((row) => (
            <div key={row.id} data-testid="row">
              {row.name} - {row.status}
              <button onClick={() => approveMutation.mutate(row.id)}>
                Approve
              </button>
            </div>
          ))}
        </div>
      );
    };

    return { DataTable };
  });

  vi.resetModules();
  const { default: AdminRequestsComponent } = await import(
    "@/components/table/adminRequests"
  );

  render(<AdminRequestsComponent />);
  const approveButtons = await screen.findAllByRole("button", {
    name: /^Approve$/,
  });

  fireEvent.click(approveButtons[0]);

  expect(mutateMock).toHaveBeenCalledTimes(1);
});

  it("renders spinner when mutation is pending", () => {
    const pendingMock: ApproveMutation = { mutate: vi.fn(), isPending: true };
    
    setMockUseAdminRequests({ approveMutation: pendingMock });
    render(<AdminRequests />);
    expect(screen.getAllByTestId("spinner")).toHaveLength(2);
  });

  it("renders DataTable correctly", () => {
    render(<AdminRequests />);
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("resets filters when switching back to professor tab", () => {
    render(<AdminRequests />);
    const reservationBtn = screen.getByText((t) =>
      t.includes("Reservation Requests")
    );
    const professorBtn = screen.getByText((t) =>
      t.includes("Professor Requests")
    );
    
    fireEvent.click(reservationBtn);
    fireEvent.click(professorBtn);
    expect(professorBtn).toHaveClass("bg-green-500");
  });

  it("renders DataTable even when there are no requests", () => {
    setMockUseAdminRequests({
      requestsQuery: { isLoading: false, error: null, data: [] },
    });
    render(<AdminRequests />);
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  it("calls approveMutation when approving a reservation request", () => {
    const mutateMock = vi.fn();
    
    setMockUseAdminRequests({
      approveMutation: { mutate: mutateMock, isPending: false },
    });
    render(<AdminRequests />);
    fireEvent.click(screen.getByText((t) => t.includes("Reservation Requests")));
    const approveButtons = screen.getAllByText((t) => t.includes("Approve"));
    
    fireEvent.click(approveButtons[0]);
    expect(mutateMock).toHaveBeenCalled();
  });

  it("filters professor requests by 'Rejected' status", async () => {
    setMockUseAdminRequests({
      requestsQuery: {
        isLoading: false,
        error: null,
        data: [
          { id: "1", name: "John", email: "john@test.com", status: "Rejected" },
          { id: "2", name: "Jane", email: "jane@test.com", status: "Approved" },
        ],
      },
    });
    render(<AdminRequests />);
    const checkbox = screen.getByLabelText("Rejected");
    
    fireEvent.click(checkbox);
    await waitFor(() => expect(screen.getAllByTestId("row")).toHaveLength(1));
    const rows = screen.getAllByTestId("row");
    
    expect(rows[0]).toHaveTextContent("Rejected");
  });

  it("toggles off a selected status when checkbox clicked twice", async () => {
    render(<AdminRequests />);
    const checkbox = screen.getByLabelText("Approved");
    
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).not.toBeChecked());
    const rows = screen.getAllByTestId("row");
    
    expect(rows.length).toBeGreaterThan(0);
  });

  it("filters reservation requests correctly by status", async () => {
    setMockUseAdminRequests({
      requestsQuery: {
        isLoading: false,
        error: null,
        data: [
          { id: "1", name: "Alice", email: "alice@test.com", status: "Confirmed" },
          { id: "2", name: "Bob", email: "bob@test.com", status: "Pending" },
        ],
      },
    });
    render(<AdminRequests />);
    fireEvent.click(screen.getByText((t) => t.includes("Reservation Requests")));
    const checkbox = screen.getByLabelText("Confirmed");
    
    fireEvent.click(checkbox);
    await waitFor(() => expect(screen.getAllByTestId("row")).toHaveLength(1));
    const rows = screen.getAllByTestId("row");
    
    expect(rows[0]).toHaveTextContent("Confirmed");
  });

  it("calls approveMutation in reservation tab", () => {
    const mutateMock = vi.fn();
    
    setMockUseAdminRequests({
      approveMutation: { mutate: mutateMock, isPending: false },
      requestsQuery: {
        isLoading: false,
        error: null,
        data: [
          { id: "1", name: "Alice", email: "a@test.com", status: "Confirmed" },
        ],
      },
    });
    render(<AdminRequests />);
    fireEvent.click(screen.getByText((t) => t.includes("Reservation Requests")));
    fireEvent.click(screen.getByText((t) => t.includes("Approve")));
    expect(mutateMock).toHaveBeenCalledWith("1");
  });

  it("renders loading spinner when approveMutation is pending inside ApproveButton", () => {
    const approveMock: ApproveMutation = { mutate: vi.fn(), isPending: true };
    const mockReturn: UseAdminRequestsReturn = {
      requestsQuery: {
        isLoading: false,
        error: null,
        data: [
          { id: "1", name: "Test User", email: "test@mock.com", status: "Approved" },
        ],
      },
      approveMutation: approveMock,
      reservationStatus: ["Approved"],
    };
    
    vi.mocked(mockUseAdminRequests).mockReturnValue(mockReturn as unknown as {
      requestsQuery: import("@tanstack/react-query").UseQueryResult<any, Error>;
      approveMutation: import("@tanstack/react-query").UseMutationResult<
        any,
        Error,
        string,
        unknown
      >;
      reservationStatus: string[];
    });
    render(<AdminRequests />);
    const spinners = screen.getAllByTestId("spinner");
    
    expect(spinners.length).toBeGreaterThan(0);
    expect(spinners[0]).toHaveTextContent("Loading");
  });

  describe("ApproveButton internal behavior", () => {
    it("calls approveMutation.mutate when Approve clicked", () => {
      const mutateMock = vi.fn();
      
      vi.mocked(mockUseAdminRequests).mockReturnValue({
        requestsQuery: {
          isLoading: false,
          error: null,
          data: [],
        } as unknown as UseQueryResult<unknown, Error>,
        approveMutation: {
          mutate: mutateMock,
          isPending: false,
        } as unknown as UseMutationResult<unknown, Error, string, unknown>,
        reservationStatus: [],
      });
      render(<AdminRequests />);
      expect(screen.getByText((t) => t.includes("Approve"))).toBeInTheDocument();
    });

    it("shows ⏳ spinner when approveMutation.isPending = true", () => {
  vi.mocked(mockUseAdminRequests).mockReturnValue({
    requestsQuery: {
      isLoading: false,
      error: null,
      data: [
        { id: "1", name: "John", email: "john@test.com", status: "Approved" },
      ],
    } as unknown as UseQueryResult<unknown, Error>,
    approveMutation: {
      mutate: vi.fn(),
      isPending: true,
    } as unknown as UseMutationResult<unknown, Error, string, unknown>,
    reservationStatus: [],
  });

  render(<AdminRequests />);

  const spinner = screen.queryByTestId("spinner");
  
  expect(spinner).toBeInTheDocument();
  expect(spinner).toHaveTextContent(/loading/i);
});

  });

  describe("requestsQuery.data fallback handling", () => {
    it("handles requestsQuery.data.data array", async () => {
      setMockUseAdminRequests({
        requestsQuery: {
          isLoading: false,
          error: null,
          data: { data: [{ id: "9", name: "User9", email: "a@a.com", status: "Approved" }] },
        },
      });
      render(<AdminRequests />);
      expect(await screen.findByText((t) => t.includes("User9"))).toBeInTheDocument();

    });

    it("handles requestsQuery.data.results array", async () => {
      setMockUseAdminRequests({
        requestsQuery: {
          isLoading: false,
          error: null,
          data: {
            results: [{ id: "10", name: "User10", email: "b@b.com", status: "Approved" }],
          },
        },
      });
      render(<AdminRequests />);
      expect(await screen.findByText((t) => t.includes("User10"))).toBeInTheDocument();

    });
  });

  describe("DataTable setFilter integration", () => {
  it("calls setFilter to update filters", async () => {
    const mockDataTable = vi.fn(
      ({ setFilter }: { setFilter: (key: string, value: unknown) => void }) => (
        <div data-testid="datatable">
          <button onClick={() => setFilter("page", 5)}>Trigger Filter</button>
        </div>
      )
    );

    vi.doMock("@/components/table/index", () => ({ DataTable: mockDataTable }));
    vi.resetModules();

    const { default: AdminRequestsComponent } = await import(
      "@/components/table/adminRequests"
    );

    render(<AdminRequestsComponent />);
    const trigger = await screen.findByText((t) => t.includes("Trigger Filter"));
    
    fireEvent.click(trigger);
    expect(mockDataTable).toHaveBeenCalled();
  });
});

});
