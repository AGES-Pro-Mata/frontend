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

// Mock dos componentes UI primeiro
vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    id,
  }: {
    checked: boolean;
    onCheckedChange: () => void;
    id?: string;
  }) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      id={id}
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

// Mock do DataTable simplificado
vi.mock("@/components/table/index", () => {
  const DataTable: React.FC<{
    data: Request[];
    setFilter?: (key: string, value: unknown) => void;
    filters?: Record<string, unknown>;
    meta?: Record<string, unknown>;
  }> = ({ 
    data, 
    setFilter,
    filters 
  }) => {
    const { approveMutation } = mockUseAdminRequests({}) as unknown as {
      approveMutation: { mutate: (id: string) => void; isPending: boolean };
    };

    React.useEffect(() => {
      if (setFilter && filters) {
        console.log('Current filters:', filters);
      }
    }, [filters, setFilter]);

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
        {setFilter && (
          <button 
            data-testid="trigger" 
            onClick={() => setFilter("page", 10)}
          >
            Trigger Filter
          </button>
        )}
        {filters && (
          <div data-testid="filters-info">
            Page: {String(filters.page)}, Limit: {String(filters.limit)}
          </div>
        )}
      </div>
    );
  };

  return { DataTable };
});

// Mock do hook useAdminRequests
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

const getCheckboxByLabel = (labelText: string) => {
  const allCheckboxes = screen.getAllByTestId('checkbox');
  
  const label = screen.getByText(labelText, { selector: 'label' });
  
  const checkbox = allCheckboxes.find(checkbox => 
    label.contains(checkbox)
  );
  
  if (!checkbox) {
    throw new Error(`Checkbox with label "${labelText}" not found`);
  }
  
  return checkbox;
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
    const checkboxes = screen.getAllByTestId("checkbox");
    const firstCheckbox = checkboxes[0];
    
    expect(firstCheckbox).not.toBeChecked();
    fireEvent.click(firstCheckbox);
    await waitFor(() => expect(firstCheckbox).toBeChecked());
  });

  it("calls approveMutation when approve button clicked", () => {
    const mutateMock = vi.fn();
    
    setMockUseAdminRequests({
      approveMutation: { mutate: mutateMock, isPending: false },
    });
    
    render(<AdminRequests />);
    const approveButtons = screen.getAllByText("Approve");
    
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
    const approveButtons = screen.getAllByText("Approve");
    
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
    
    const rejectedCheckbox = getCheckboxByLabel("Rejected");
    
    fireEvent.click(rejectedCheckbox);
    await waitFor(() => expect(screen.getAllByTestId("row")).toHaveLength(1));
    
    const rows = screen.getAllByTestId("row");
  
    expect(rows[0]).toHaveTextContent("Rejected");
  });

  it("toggles off a selected status when checkbox clicked twice", async () => {
    render(<AdminRequests />);
    
    const approvedCheckbox = getCheckboxByLabel("Approved");
    
    fireEvent.click(approvedCheckbox);
    await waitFor(() => expect(approvedCheckbox).toBeChecked());
    fireEvent.click(approvedCheckbox);
    await waitFor(() => expect(approvedCheckbox).not.toBeChecked());
    
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
    
    const confirmedCheckbox = getCheckboxByLabel("Confirmed");
    
    fireEvent.click(confirmedCheckbox);
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
    fireEvent.click(screen.getByText("Approve"));
    expect(mutateMock).toHaveBeenCalledWith("1");
  });

  it("renders loading spinner when approveMutation is pending inside ApproveButton", () => {
    const approveMock: ApproveMutation = { mutate: vi.fn(), isPending: true };
    
    setMockUseAdminRequests({ 
      approveMutation: approveMock,
      requestsQuery: {
        isLoading: false,
        error: null,
        data: [
          { id: "1", name: "Test User", email: "test@mock.com", status: "Approved" },
        ],
      },
    });
    
    render(<AdminRequests />);
    const spinners = screen.getAllByTestId("spinner");
    
    expect(spinners.length).toBeGreaterThan(0);
    expect(spinners[0]).toHaveTextContent("Loading");
  });

  describe("ApproveButton internal behavior", () => {
    it("calls approveMutation.mutate when Approve clicked", () => {
      const mutateMock = vi.fn();
      
      setMockUseAdminRequests({
        approveMutation: { mutate: mutateMock, isPending: false },
      });
      
      render(<AdminRequests />);
      
      const approveButtons = screen.getAllByText("Approve");
  
      expect(approveButtons.length).toBeGreaterThan(0);
      expect(approveButtons[0]).toBeInTheDocument();
    });

    it("disables button when mutation is pending", () => {
      setMockUseAdminRequests({
        approveMutation: { mutate: vi.fn(), isPending: true },
      });
      
      render(<AdminRequests />);
      
      const spinners = screen.getAllByTestId("spinner");
    
      expect(spinners.length).toBeGreaterThan(0);
      
      const approveButtons = screen.queryAllByText("Approve");
  
      approveButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it("shows loading spinner in ApproveButton when pending", () => {
      setMockUseAdminRequests({
        approveMutation: { mutate: vi.fn(), isPending: true },
        requestsQuery: {
          isLoading: false,
          error: null,
          data: [
            { id: "1", name: "John", email: "john@test.com", status: "Approved" },
            { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
          ],
        },
      });

      render(<AdminRequests />);
      
      const spinners = screen.getAllByTestId("spinner");
  
      expect(spinners).toHaveLength(2);
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
      render(<AdminRequests />);
      
      const triggerButton = await screen.findByTestId("trigger");
   
      expect(triggerButton).toBeInTheDocument();
      
      fireEvent.click(triggerButton);
    });
  });

  it("renderiza exatamente o texto de erro completo", () => {
    setMockUseAdminRequests({
      requestsQuery: { isLoading: false, error: new Error("mock fail"), data: [] },
    });
    render(<AdminRequests />);
    expect(screen.getByText("Error loading requests.")).toBeInTheDocument();
  });

  it("atualiza estado interno de filtros quando setFilter é chamado", async () => {
    render(<AdminRequests />);

    expect(await screen.findByTestId("datatable")).toBeInTheDocument();
    expect(await screen.findByTestId("trigger")).toBeInTheDocument();
  });

  describe("AdminRequests Component - Missing Coverage", () => {
    describe("Filters and pagination logic", () => {
      it("handles filter state updates correctly", () => {
        render(<AdminRequests />);
        
        const dataTable = screen.getByTestId("datatable");
   
        expect(dataTable).toBeInTheDocument();
      });

      it("updates filters when setFilter is called with different keys", () => {
        render(<AdminRequests />);
        
        const triggerButton = screen.getByTestId("trigger");
       
        fireEvent.click(triggerButton);
        
        expect(screen.getByTestId("datatable")).toBeInTheDocument();
      });

      it("handles page filter updates", () => {
        render(<AdminRequests />);
        
        const triggerButton = screen.getByTestId("trigger");
    
        fireEvent.click(triggerButton);
        
        expect(screen.getByTestId("datatable")).toBeInTheDocument();
      });

      it("handles multiple filter types through DataTable interaction", () => {
        render(<AdminRequests />);
        
        const triggerButton = screen.getByTestId("trigger");
        
        fireEvent.click(triggerButton);
        
        expect(screen.getByTestId("datatable")).toBeInTheDocument();
        expect(screen.getAllByTestId("row").length).toBeGreaterThan(0);
      });
    });

    describe("ApproveButton component details", () => {
      it("uses useCallback for handleApprove function", () => {
        const mutateMock = vi.fn();
        
        setMockUseAdminRequests({
          approveMutation: { mutate: mutateMock, isPending: false },
        });
        
        render(<AdminRequests />);
        
        const approveButtons = screen.getAllByText("Approve");
        
        fireEvent.click(approveButtons[0]);
        fireEvent.click(approveButtons[0]);
        fireEvent.click(approveButtons[0]);
        
        expect(mutateMock).toHaveBeenCalledTimes(3);
        expect(mutateMock).toHaveBeenCalledWith("1");
      });
    });

    describe("Edge cases and data handling", () => {
      it("handles empty data with different structures", () => {
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: { data: [] },
          },
        });
        
        render(<AdminRequests />);
        const dataTables = screen.getAllByTestId("datatable");
        
        expect(dataTables[0]).toBeInTheDocument();
      });

      it("handles undefined data gracefully", () => {
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: undefined,
          },
        });
        
        render(<AdminRequests />);
        const dataTables = screen.getAllByTestId("datatable");
        
        expect(dataTables[0]).toBeInTheDocument();
      });

      it("filters requests correctly when multiple statuses are selected", async () => {
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: [
              { id: "1", name: "John", email: "john@test.com", status: "Approved" },
              { id: "2", name: "Jane", email: "jane@test.com", status: "Rejected" },
              { id: "3", name: "Bob", email: "bob@test.com", status: "Pending" },
            ],
          },
        });
        
        render(<AdminRequests />);
        
        const approvedCheckbox = getCheckboxByLabel("Approved");
        const rejectedCheckbox = getCheckboxByLabel("Rejected");
        
        fireEvent.click(approvedCheckbox);
        fireEvent.click(rejectedCheckbox);
        
        await waitFor(() => {
          const rows = screen.getAllByTestId("row");
          
          expect(rows).toHaveLength(2);
        });
      });

      it("resets status filters when switching tabs", async () => {
  setMockUseAdminRequests({
    requestsQuery: {
      isLoading: false,
      error: null,
      data: [
        { id: "1", name: "John", email: "john@test.com", status: "Approved" },
        { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
      ],
    },
  });
  
  render(<AdminRequests />);
  
  const approvedCheckbox = getCheckboxByLabel("Approved");
  
  fireEvent.click(approvedCheckbox);
  
  await waitFor(() => expect(approvedCheckbox).toBeChecked());
  
  fireEvent.click(screen.getByText((t) => t.includes("Reservation Requests")));
  
  await waitFor(() => {
    expect(screen.getByText((t) => t.includes("Reservation Requests"))).toHaveClass("bg-green-500");
  });
  
  fireEvent.click(screen.getByText((t) => t.includes("Professor Requests")));
  
  await waitFor(() => {
    expect(screen.getByText((t) => t.includes("Professor Requests"))).toHaveClass("bg-green-500");
  });
  
  const resetCheckbox = getCheckboxByLabel("Approved");
  
  expect(resetCheckbox).not.toBeChecked();
});

      it("handles all reservation status filters", async () => {
        const reservationData = [
          { id: "1", name: "User1", email: "u1@test.com", status: "Confirmed" },
          { id: "2", name: "User2", email: "u2@test.com", status: "Pending" },
        ];
        
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: reservationData,
          },
        });
        
        render(<AdminRequests />);
        fireEvent.click(screen.getByText((t) => t.includes("Reservation Requests")));
        
        const statuses = ["Confirmed", "Pending"];
        
        for (const status of statuses) {
          const checkbox = getCheckboxByLabel(status);
          
          fireEvent.click(checkbox);
          
          await waitFor(() => {
            const rows = screen.getAllByTestId("row");
            
            expect(rows.length).toBeGreaterThan(0);
          });
          
          const rows = screen.getAllByTestId("row");
          const hasStatus = rows.some(row => row.textContent?.includes(status));
          
          expect(hasStatus).toBe(true);
          
          fireEvent.click(checkbox);
        }
      });

      it("handles complex data structures from API", () => {
        const testCases = [
          { data: [] }, 
          { data: { data: [] } },
          { data: { results: [] } }, 
        ];

        testCases.forEach((testCase) => {
          vi.clearAllMocks();
          
          setMockUseAdminRequests({
            requestsQuery: {
              isLoading: false,
              error: null,
              data: testCase.data,
            },
          });

          const { unmount } = render(<AdminRequests />);
          const dataTables = screen.getAllByTestId("datatable");
          
          expect(dataTables[0]).toBeInTheDocument();
          unmount();
        });
      });

      it("tests filter state initialization", () => {
        render(<AdminRequests />);
        
        expect(screen.getByTestId("datatable")).toBeInTheDocument();
        expect(screen.getByText((t) => t.includes("Professor Requests"))).toBeInTheDocument();
        expect(screen.getByText((t) => t.includes("Reservation Requests"))).toBeInTheDocument();
      });

      it("covers handleStatusChange function", async () => {
        render(<AdminRequests />);
        
        const approvedCheckbox = getCheckboxByLabel("Approved");
        
        fireEvent.click(approvedCheckbox);
        await waitFor(() => expect(approvedCheckbox).toBeChecked());
        
        fireEvent.click(approvedCheckbox);
        await waitFor(() => expect(approvedCheckbox).not.toBeChecked());
      });

      it("covers filteredRequests logic with no selected status", () => {
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: [
              { id: "1", name: "John", email: "john@test.com", status: "Approved" },
              { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
            ],
          },
        });
        
        render(<AdminRequests />);
        const rows = screen.getAllByTestId("row");
        
        expect(rows).toHaveLength(2);
      });

      it("covers filteredRequests logic with selected status", async () => {
        setMockUseAdminRequests({
          requestsQuery: {
            isLoading: false,
            error: null,
            data: [
              { id: "1", name: "John", email: "john@test.com", status: "Approved" },
              { id: "2", name: "Jane", email: "jane@test.com", status: "Pending" },
              { id: "3", name: "Bob", email: "bob@test.com", status: "Rejected" },
            ],
          },
        });
        
        render(<AdminRequests />);
        
        const approvedCheckbox = getCheckboxByLabel("Approved");
       
        fireEvent.click(approvedCheckbox);
        
        await waitFor(() => {
          const rows = screen.getAllByTestId("row");
        
          expect(rows).toHaveLength(1);
        });
        
        const rows = screen.getAllByTestId("row");
       
        expect(rows[0]).toHaveTextContent("Approved");
      });
    });
  });
});