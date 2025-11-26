import { render } from "@testing-library/react";
import React from "react";
import { AppToast, appToast } from "@/components/toast/toast";

const customMock = vi.hoisted(() => vi.fn());
const toasterSpy = vi.hoisted(() => vi.fn());

vi.mock("sonner", () => ({
  toast: { custom: customMock },
  Toaster: (props: Record<string, unknown>) => {
    toasterSpy(props);

    return <div data-testid="toaster" {...props} />;
  },
}));

describe("appToast helper", () => {
  beforeEach(() => {
    customMock.mockClear();
    toasterSpy.mockClear();
  });

  it("renders custom toast content with default success styling", () => {
    appToast.success("Hello world");

    const [renderer, opts] = customMock.mock.calls[0] as [
      () => React.ReactElement<{ className?: string }>,
      { position?: string; duration?: number },
    ];

    expect(opts.position).toBe("top-center");
    expect(opts.duration).toBe(3500);

    const element = renderer() as React.ReactElement<{ className?: string }>;

    expect(element.props.className).toContain("bg-contrast-green");
    expect(element.props.className).toContain("mx-auto");
  });

  it("allows overriding options and description across variants", () => {
    appToast.info("Info", {
      position: "bottom-center",
      description: "More details",
      icon: <span data-testid="icon" />,
      className: "extra",
      duration: 999,
    });

    const [renderer, opts] = customMock.mock.calls.at(-1)! as [
      () => React.ReactElement,
      { position?: string; duration?: number },
    ];

    expect(opts.position).toBe("bottom-center");
    expect(opts.duration).toBe(999);

    const { getByText, getByTestId } = render(renderer());

    expect(getByText("Info")).toBeInTheDocument();
    expect(getByText("More details")).toBeInTheDocument();
    expect(getByTestId("icon")).toBeInTheDocument();
  });

  it("covers warning and error variants with defaults", () => {
    appToast.error("Oops");
    appToast.warning("Heads up", { description: "Watch out" });

    const [renderError, errorOpts] = customMock.mock.calls.at(-2)! as [
      () => React.ReactElement,
      { duration?: number; className?: string },
    ];
    const [renderWarn, warnOpts] = customMock.mock.calls.at(-1)! as [
      () => React.ReactElement,
      { duration?: number; className?: string },
    ];

    expect(errorOpts.duration).toBe(4000);
    expect(warnOpts.duration).toBe(4000);

    const errorEl = renderError() as React.ReactElement<{ className?: string }>;
    const warnEl = renderWarn() as React.ReactElement<{ className?: string }>;

    expect(errorEl.props.className).toContain("bg-default-red");
    expect(warnEl.props.className).toContain("bg-warning");
  });

  it("uses default info variant options and renders non-string content", () => {
    appToast.info(<span>NodeContent</span>);

    const [renderInfo, infoOpts] = customMock.mock.calls.at(-1)! as [
      () => React.ReactElement,
      { duration?: number; className?: string },
    ];

    expect(infoOpts.duration).toBe(3000);

    const infoEl = renderInfo() as React.ReactElement<{ className?: string }>;

    expect(infoEl.props.className).toContain("bg-soft-blue");
  });

  it("exposes AppToast wrapper forwarding props to Toaster", () => {
    render(<AppToast position="bottom-right" />); // position override should pass through

    expect(toasterSpy).toHaveBeenCalledWith(
      expect.objectContaining({ position: "bottom-right" }),
    );
  });
});
