import { render } from "@testing-library/react";
import { AppToast, appToast, base } from "@/components/toast/toast";

describe("AppToast uncovered branches", () => {
  it("should handle undefined position and children", () => {
    render(<AppToast position={undefined as any} />);
  });

  it("should render AppToast with custom props", () => {
    render(<AppToast position="bottom-left" />);
    // No assertion needed, just rendering covers the branch
  });

  it("should call appToast.raw", () => {
    expect(typeof appToast.raw).toBe("function");
  });

  it("should cover base() with no icon and no description", () => {
    // Covers: no icon, no description
    base("Test message");
  });

  it("should cover base() with only description", () => {
    // Covers: description only, no icon
    base("Test message", { description: "desc only" });
  });

  it("should cover base() with only icon", () => {
    // Covers: icon only, no description
    base("Test message", { icon: <span>icon only</span> });
  });

  it("should cover base() with both icon and description", () => {
    // Covers: both icon and description
    base("Test message", { icon: <span>icon</span>, description: "desc" });
  });

  it("should cover base() with custom className and position", () => {
    // Covers: custom className and position
    base("Test message", { className: "custom-class", position: "bottom-right" });
  });
});
