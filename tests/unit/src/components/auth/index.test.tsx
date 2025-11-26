import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AuthCard as ReExported } from "@/components/auth";
import { AuthCard as Direct } from "@/components/auth/authcard";

describe("components/auth index", () => {
  it("re-exports AuthCard and renders children", () => {
    // ensure the index re-export points to the same component
    expect(ReExported).toBe(Direct);

    render(
      <ReExported>
        <div>hello-auth</div>
      </ReExported>,
    );

    expect(screen.getByText("hello-auth")).toBeDefined();
  });
});
