import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminRequests from "@/components/table/adminRequests";
import { useAdminRequests } from "@/hooks/useAdminRequests";

vi.mock("@/hooks/useAdminRequests");

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      data-testid="checkbox"
    />
  ),
}));

import * as AdminHook from "@/hooks/useAdminRequests";

vi.mock("@/components/table/index", () => ({
  DataTable: ({ data }: any) => {
    const { approveMutation } = AdminHook.useAdminRequests({});
    return (
      <table data-testid="data-table">
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>
                {approveMutation.isPending ? (
                  <span data-testid={`spinner-${row.id}`}>⏳</span>
                ) : (
                  <button
                    data-testid={`approve-${row.id}`}
                    onClick={() => approveMutation.mutate(row.id)}
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

describe("AdminRequests", () => {
  const mockRequests = [
    { id: "1", name: "John", email: "john@test.com", status: "Approved" },
    { id: "2", name: "Mary", email: "mary@test.com", status: "Pending" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (useAdminRequests as any).mockReturnValue({
      requestsQuery: { isLoading: true },
    });

    render(<AdminRequests />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useAdminRequests as any).mockReturnValue({
      requestsQuery: { isLoading: false, error: true },
    });

    render(<AdminRequests />);
    expect(screen.getByText(/error loading requests/i)).toBeInTheDocument();
  });

  it("calls approve mutation on ApproveButton click", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

    (useAdminRequests as any).mockReturnValue({
      requestsQuery: { isLoading: false, data: mockRequests, error: null },
      approveMutation: { mutate: mutateMock, isPending: false },
    });

    render(<AdminRequests />);
    const approveBtn = screen.getByTestId("approve-1");
    await user.click(approveBtn);

    expect(mutateMock).toHaveBeenCalledWith("1");
  });

  it("shows spinner when approving", () => {
    (useAdminRequests as any).mockReturnValue({
      requestsQuery: { isLoading: false, data: mockRequests, error: null },
      approveMutation: { mutate: vi.fn(), isPending: true },
    });

    render(<AdminRequests />);
    const spinner = screen.getByTestId("spinner-1");
    expect(spinner).toBeInTheDocument();
  });
});
